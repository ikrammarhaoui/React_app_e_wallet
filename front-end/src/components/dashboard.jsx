import Footer from "./footer";
import img from "../assets/e-Wallet6.gif" 

function Dashboard() {
  return (
    <>
      {/* Header */}
      <header>
        <nav className="navbar">
          <a href="index.html" className="logo">
            <img src={img} alt="Logo E-Wallet" />
          </a>
          <ul className="nav-links"></ul>
        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* Sidebar */}
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

          {/* Content */}
          <div className="dashboard-content">

            {/* OVERVIEW */}
            <section id="overview" className="dashboard-section active">
              <div className="section-header">
                <h2>
                  Bonjour, <span id="greetingName">?</span> !
                </h2>
                <p id="currentDate"></p>
              </div>

              {/* Summary cards */}
              <div className="summary-cards">

                <div className="summary-card">
                  <div className="card-icon blue">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div className="card-details">
                    <span>Solde disponible</span>
                    <span id="availableBalance">?</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon green">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                  <div className="card-details">
                    <span>Revenus</span>
                    <span id="monthlyIncome">?</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon red">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="card-details">
                    <span>Dépenses</span>
                    <span id="monthlyExpenses">?</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon purple">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div className="card-details">
                    <span>Cartes actives</span>
                    <span id="activeCards">?</span>
                  </div>
                </div>

              </div>

              {/* Quick actions */}
              <div className="quick-actions">
                <h3>Actions rapides</h3>

                <div className="action-buttons">
                  <button className="action-btn">
                    <i className="fas fa-paper-plane"></i>
                    Transférer
                  </button>

                  <button className="action-btn">
                    <i className="fas fa-plus-circle"></i>
                    Recharger
                  </button>

                  <button className="action-btn">
                    <i className="fas fa-hand-holding-usd"></i>
                    Demander
                  </button>
                </div>
              </div>

              {/* Transactions */}
              <div className="recent-transactions">
                <div className="section-header">
                  <h3>Transactions récentes</h3>
                </div>

                <div className="transactions-list"></div>
              </div>
            </section>

            {/* CARDS */}
            <section id="cards" className="dashboard-section">
              <div className="section-header">
                <h2>Mes cartes</h2>
                <button className="btn btn-secondary">
                  <i className="fas fa-plus"></i> Ajouter une carte
                </button>
              </div>

              <div className="cards-grid">

                <div className="card-item">
                  <div className="card-preview visa">
                    <div className="card-chip"></div>
                    <div className="card-number">?</div>
                    <div className="card-holder">?</div>
                    <div className="card-expiry">?</div>
                  </div>

                  <div className="card-actions">
                    <button><i className="fas fa-star"></i></button>
                    <button><i className="fas fa-snowflake"></i></button>
                    <button><i className="fas fa-trash"></i></button>
                  </div>
                </div>

              </div>
            </section>

            {/* TRANSFERS */}
            <section id="transfers" className="dashboard-section hidden">
              <div className="section-header">
                <h2>Effectuer un transfert</h2>
              </div>

              <form className="transfer-form">

                <div className="form-group">
                  <label>Bénéficiaire</label>
                  <select>
                    <option>Choisir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Carte source</label>
                  <select>
                    <option>Choisir carte</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Montant</label>
                  <input type="number" placeholder="0.00" />
                </div>

                <div className="form-actions">
                  <button type="button">Annuler</button>
                  <button type="submit">Transférer</button>
                </div>

              </form>
            </section>

          </div>
        </div>
      </main>

    <Footer></Footer>
    </>
  );
}

export default Dashboard;