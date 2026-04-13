
import Footer from "./footer";
import Header from "./header";
import image from '../assets/e-Wallet6.gif' ;
function Login() {
return (
    <>
    <Header></Header>
      <main>
    <section class="hero">

      <div class="hero-content">
        <h1>Connexion</h1>
        <p>Accédez à votre E-Wallet en toute sécurité et gérez vos transactions en toute confiance.</p>
        <div id="error"></div>
        <form class="login-form">
          <div class="input-group">
            <input id="mail" type="email" placeholder="Adresse e-mail" required/>
          </div>
          <div class="input-group">
            <input id="password" type="password" placeholder="Mot de passe" required/>
            <span id="display" class="toggle-password">👁</span>
          </div>
          <p id="result"></p>
          <button id="submitbtn" type="button" class="btn btn-primary">Se connecter</button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Vous n'avez pas encore de compte ?
          <a href="#" style={{ color: '#3b66f6', fontWeight: '600' }}>S'inscrire</a>
        </p>
      </div>

      <div class="hero-image">
        <img src={image} alt="Illustration de connexion" />
      </div>

    </section>
  </main>
    <Footer></Footer>
  </>
)
}


export default Login;