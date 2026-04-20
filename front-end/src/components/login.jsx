import Footer from "./footer.jsx";
import Header from "./Header.jsx";
import img from "../assets/e-Wallet6.gif";
import { useState } from "react";
import { finduserbymail } from "../database.js";
function Login({ setIsLoggedIn, IsLoggedIn ,setUser  }) {
  const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

const handleLogin = () => {
  const user = finduserbymail(email, password);
  if (user) {
    sessionStorage.setItem("currentUser", JSON.stringify(user)); 
    setUser(user);
    setIsLoggedIn(true);
  } else {
    alert("Bad credentials.");
  }
};
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Connexion</h1>
            <p>
              Accédez à votre E-Wallet en toute sécurité et gérez vos transactions en toute confiance.
            </p>

            <form className="login-form">
              <div className="input-group">
                <input value={email} type="email"  onChange={(e)=>{
                  setEmail(e.target.value)
                }}
                placeholder="Adresse e-mail" required />
              </div>
              <div className="input-group">
                <input value={password}   onChange={(e)=>{
                  setPassword(e.target.value)
                }} type="password" placeholder="Mot de passe" required />
                <span className="toggle-password">👁</span>
              </div>

              <button type="button" className="btn btn-primary" onClick={handleLogin}>Se connecter</button>
            </form>

            <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
              Vous n’avez pas encore de compte ? 
              <a href="#" style={{ color: "#3b66f6", fontWeight: "600" }}>S’inscrire</a>
            </p>
          </div>

          <div className="hero-image">
            <img src={img} alt="Illustration de connexion" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Login;