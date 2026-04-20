import { useState } from "react";
import Footer from "./footer";
import img from "../assets/e-wallet-logo.avif";
import {
  getbeneficiaries,
  finduserbyaccount,
  findbeneficiarieByid,
  isCardExpired,
} from "../Model/database.js";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [, forceUpdate] = useState(0);
  const refresh = () => {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    forceUpdate((n) => n + 1);
  };

  // Popups visibility
  const [showTransfer, setShowTransfer] = useState(false);
  const [showTopup, setShowTopup]       = useState(false);

  // Transfer form state
  const [beneficiaryId, setBeneficiaryId]   = useState("");
  const [sourceCardNum, setSourceCardNum]   = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  // Topup form state
  const [topupCard, setTopupCard]     = useState("");
  const [topupAmount, setTopupAmount] = useState("");
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupMsg, setTopupMsg]       = useState({ text: "", cls: "recharger-message" });

  if (!user) {
    alert("User not authenticated");
    window.location.href = "/index.html";
    return null;
  }

  const beneficiaries = getbeneficiaries(user.id);

  // ── Dashboard computed values ──────────────────────────────────────
  const monthlyIncome = user.wallet.transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  // ── Transfer promises (same logic as dashboard.js) ─────────────────
  function checkUser(numcompte) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dest = finduserbyaccount(numcompte);
        dest ? resolve(dest) : reject("beneficiary not found");
      }, 2000);
    });
  }

  function checkSolde(expediteur, amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        expediteur.wallet.balance > amount
          ? resolve("Sufficient balance")
          : reject("Insufficient balance");
      }, 3000);
    });
  }

  function updateSolde(expediteur, destinataire, amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        expediteur.wallet.balance  -= amount;
        destinataire.wallet.balance += amount;
        resolve("update balance done");
      }, 200);
    });
  }

  function addtransactions(expediteur, destinataire, amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const credit = {
          id: Date.now(),
          type: "credit",
          amount,
          date: new Date().toLocaleDateString("fr-FR"),
          from: expediteur.name,
        };
        const debit = {
          id: Date.now(),
          type: "debit",
          amount,
          date: new Date().toLocaleDateString("fr-FR"),
          to: destinataire.name,
        };
        expediteur.wallet.transactions.push(debit);
        destinataire.wallet.transactions.push(credit);
        resolve("transaction added successfully");
      }, 3000);
    });
  }

  async function transfer(expediteur, numcompte, amount) {
    try {
      const destinataire = await checkUser(numcompte);
      console.log("Étape 1: Beneficiary found", destinataire.name);
      await checkSolde(expediteur, amount);
      console.log("Étape 2: Sufficient balance");
      await updateSolde(expediteur, destinataire, amount);
      console.log("Étape 3: Update balance done");
      const message = await addtransactions(expediteur, destinataire, amount);
      console.log("Étape 4:", message);
      refresh();
      setShowTransfer(false);
    } catch (error) {
      console.log("Erreur lors du transfert :", error);
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();
    const bAccount = findbeneficiarieByid(user.id, beneficiaryId).account;
    const amount   = Number(transferAmount);
    setTransferLoading(true);
    await transfer(user, bAccount, amount);
    setTransferLoading(false);
  }

  // ── Topup promises (same logic as dashboard.js) ────────────────────
  function verifierAmount(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!amount || amount <= 0) reject("Le montant doit être > 0.");
        else if (amount < 10)       reject("Le montant min est 10 MAD.");
        else if (amount > 5000)     reject("Le montant max est 5000 MAD.");
        else                        resolve(amount);
      }, 300);
    });
  }

  function updateWalletBalance(amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        user.wallet.balance += amount;
        resolve("changement de solde effectué");
      }, 400);
    });
  }

  function addRechargeTransaction(amount, card) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = {
          id:   String(Date.now()),
          type: "recharge",
          amount,
          date: new Date().toLocaleDateString("fr-FR"),
          from: `${card.type.toUpperCase()} **** ${card.numcards.slice(-4)}`,
          to:   user.account,
        };
        user.wallet.transactions.push(transaction);
        resolve("Transaction RECHARGE enregistrée.");
      }, 300);
    });
  }

  async function recharger(userId, numcard, amount) {
    const validatedCard = user.wallet.cards.find((c) => c.numcards === numcard);
    if (!validatedCard) { console.log("Carte invalide !"); return; }
    if (isCardExpired(validatedCard)) { console.log("Cette carte est expirée !"); return; }

    setTopupLoading(true);
    setTopupMsg({ text: "", cls: "recharger-message" });

    try {
      const validAmount = await verifierAmount(amount);
      console.log("Étape 2 : Montant valide", validAmount, "MAD");
      const msg1 = await updateWalletBalance(validAmount);
      console.log("Étape 3 :", msg1);
      const msg2 = await addRechargeTransaction(amount, validatedCard);
      console.log("Étape 4 :", msg2);

      setTopupMsg({
        text: `Rechargement de ${amount} MAD effectué avec succès !`,
        cls:  "recharger-message success",
      });
      refresh();
      setTimeout(() => { setShowTopup(false); setTopupMsg({ text: "", cls: "recharger-message" }); setTopupAmount(""); }, 2000);
    } catch (error) {
      console.log("Erreur lors du rechargement :", error);
      setTopupMsg({ text: error, cls: "recharger-message error" });
    } finally {
      setTopupLoading(false);
    }
  }

  async function handleTopup(e) {
    e.preventDefault();
    setTopupMsg({ text: "", cls: "recharger-message" });
    const amount = Number(topupAmount);
    await recharger(user.id, topupCard, amount);
  }

  function handleLogout() {
    sessionStorage.removeItem("currentUser");
    if (onLogout) onLogout();
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <header>
        <nav className="navbar">
          <a href="/index.html" className="logo">
            <img src={img} alt="Logo E-Wallet" />
          </a>
          <ul className="nav-links">
            <li>
              <button
                onClick={handleLogout}
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "inherit" }}
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">

          <aside className="dashboard-sidebar">
            <nav className="sidebar-nav">
              <ul>
                <li className="active">
                  <a href="#overview">
                    <i className="fas fa-home"></i>
                    <span>Vue d'ensemble</span>
                  </a>
                </li>
                <li>
                  <a href="#transactions">
                    <i className="fas fa-exchange-alt"></i>
                    <span>Transactions</span>
                  </a>
                </li>
                <li>
                  <a href="#cards">
                    <i className="fas fa-credit-card"></i>
                    <span>Mes cartes</span>
                  </a>
                </li>
                <li>
                  <a href="#transfers">
                    <i className="fas fa-paper-plane"></i>
                    <span>Transferts</span>
                  </a>
                </li>
                <li className="separator"></li>
                <li>
                  <a href="#support">
                    <i className="fas fa-headset"></i>
                    <span>Aide & Support</span>
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="dashboard-content">

            <section id="overview" className="dashboard-section active">
              <div className="section-header">
                <h2>Bonjour, <span id="greetingName">{user.name}</span> !</h2>
                <p className="date-display" id="currentDate">
                  {new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon blue">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div className="card-details">
                    <span className="card-label">Solde disponible</span>
                    <span className="card-value" id="availableBalance">
                      {user.wallet.balance} {user.wallet.currency}
                    </span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon green">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                  <div className="card-details">
                    <span className="card-label">Revenus</span>
                    <span className="card-value" id="monthlyIncome">{monthlyIncome} MAD</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon red">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="card-details">
                    <span className="card-label">Dépenses</span>
                    <span className="card-value" id="monthlyExpenses">{monthlyExpenses} MAD</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon purple">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div className="card-details">
                    <span className="card-label">Cartes actives</span>
                    <span className="card-value" id="activeCards">{user.wallet.cards.length}</span>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Actions rapides</h3>
                <div className="action-buttons">
                  <button className="action-btn" id="quickTransfer" type="button" onClick={() => setShowTransfer(true)}>
                    <i className="fas fa-paper-plane"></i>
                    <span>Transférer</span>
                  </button>
                  <button className="action-btn" id="quickTopup" type="button" onClick={() => setShowTopup(true)}>
                    <i className="fas fa-plus-circle"></i>
                    <span>Recharger</span>
                  </button>
                  <button className="action-btn" id="quickRequest" type="button">
                    <i className="fas fa-hand-holding-usd"></i>
                    <span>Demander</span>
                  </button>
                </div>
              </div>

              <div className="recent-transactions">
                <div className="section-header">
                  <h3>Transactions récentes</h3>
                </div>
                <div className="transactions-list" id="recentTransactionsList">
                  {user.wallet.transactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div>{transaction.date}</div>
                      <div>{transaction.amount} MAD</div>
                      <div>{transaction.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="cards" className="dashboard-section">
              <div className="section-header">
                <h2>Mes cartes</h2>
                <button className="btn btn-secondary" id="addCardBtn" type="button">
                  <i className="fas fa-plus"></i> Ajouter une carte
                </button>
              </div>

              <div className="cards-grid" id="cardsGrid">
                {user.wallet.cards.map((card) => (
                  <div key={card.numcards} className="card-item">
                    <div className={`card-preview ${card.type}`}>
                      <div className="card-chip"></div>
                      <div className="card-number">**** **** **** {card.numcards.slice(-4)}</div>
                      <div className="card-holder">{user.name}</div>
                      <div className="card-expiry">{card.expiry}</div>
                      <div className="card-type">{card.type.toUpperCase()}</div>
                    </div>
                    <div className="card-actions">
                      <button className="card-action" title="Définir par défaut" type="button">
                        <i className="fas fa-star"></i>
                      </button>
                      <button className="card-action" title="Geler la carte" type="button">
                        <i className="fas fa-snowflake"></i>
                      </button>
                      <button className="card-action" title="Supprimer" type="button">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Popup transfert — même structure que dashboard.html */}
      <div className={`popup-overlay${showTransfer ? " active" : ""}`} id="transferPopup">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Effectuer un transfert</h2>
            <button className="btn-close" id="closeTransferBtn" type="button" onClick={() => setShowTransfer(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="popup-body">
            <form id="transferForm" className="transfer-form">
              <div className="form-group">
                <label htmlFor="beneficiary">
                  <i className="fas fa-user"></i> Bénéficiaire
                </label>
                <select
                  id="beneficiary"
                  name="beneficiary"
                  required
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                >
                  <option value="" disabled>Choisir un bénéficiaire</option>
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="sourceCard">
                  <i className="fas fa-credit-card"></i> Depuis ma carte
                </label>
                <select
                  id="sourceCard"
                  name="sourceCard"
                  required
                  value={sourceCardNum}
                  onChange={(e) => setSourceCardNum(e.target.value)}
                >
                  <option value="" disabled>Sélectionner une carte</option>
                  {user.wallet.cards.map((card) => (
                    <option key={card.numcards} value={card.numcards}>
                      {card.type} **** {card.numcards}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">
                  <i></i> Montant
                </label>
                <div className="amount-input">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                  <span className="currency">MAD</span>
                </div>
              </div>

              <div className="form-options">
                <div className="checkbox-group">
                  <input type="checkbox" id="saveBeneficiary" name="saveBeneficiary" />
                  <label htmlFor="saveBeneficiary">Enregistrer ce bénéficiaire</label>
                </div>
                <div className="checkbox-group">
                  <input type="checkbox" id="instantTransfer" name="instantTransfer" />
                  <label htmlFor="instantTransfer">Transfert instantané <span className="fee-badge">+13.4 MAD</span></label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" id="cancelTransferBtn" onClick={() => setShowTransfer(false)}>
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submitTransferBtn"
                  onClick={handleTransfer}
                  disabled={transferLoading}
                >
                  <i className="fas fa-paper-plane"></i>{" "}
                  {transferLoading ? "Traitement..." : "Transférer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popup Rechargement — même structure que dashboard.html */}
      <div className={`popup-overlay${showTopup ? " active" : ""}`} id="topupPopup">
        <div className="popup-content">

          <div className="popup-header">
            <h2>Recharger Wallet</h2>
            <button className="btn-close" id="closeTopupBtn" type="button" onClick={() => setShowTopup(false)}>
              &times;
            </button>
          </div>

          <div className="popup-body">
            <form id="topupForm" className="transfer-form">

              <div className="form-group">
                <label htmlFor="topupCard"><i className="fa fa-credit-card"></i> Carte</label>
                <select
                  id="topupCard"
                  name="card"
                  value={topupCard}
                  onChange={(e) => setTopupCard(e.target.value)}
                >
                  <option value="">-- Sélectionner la carte --</option>
                  {user.wallet.cards.map((card) => (
                    <option key={card.numcards} value={card.numcards}>
                      {card.type.toUpperCase()} **** {card.numcards.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group amount-input">
                <label htmlFor="topupAmount"><i className="fa fa-money-bill"></i> Montant</label>
                <input
                  type="number"
                  id="topupAmount"
                  name="amount"
                  placeholder="0.00"
                  min="0"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                />
                <span className="currency">MAD</span>
              </div>

              <div id="rechargerMessage" className={topupMsg.cls}>{topupMsg.text}</div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" id="cancelTopupBtn" onClick={() => setShowTopup(false)}>
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submitTopupBtn"
                  onClick={handleTopup}
                  disabled={topupLoading}
                >
                  {topupLoading ? "Traitement..." : "Recharger"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2026 E-Wallet. Tous droits réservés.</p>
      </footer>
    </>
  );
}

export default Dashboard;
