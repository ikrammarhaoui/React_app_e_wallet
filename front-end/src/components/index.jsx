import image from '../assets/e-Wallet6.gif' ;
import Footer from './footer.jsx';
import Header from './header.jsx';
function Index() {
  return (
    <>
    <Header ></Header>
    <main>
    <section className="hero">
      <div className="hero-content" >
        <h1>E-Wallet</h1>
        <p>Gérez vos finances facilement et en toute sécurité. Simplifiez vos paiements et transactions grâce à notre solution moderne.</p>
        <div className="buttons">
          <button className="btn btn-primary" id="Loginbtn">Login</button>
          <button className="btn btn-secondary" id="Signinbtn">Sign in</button>
        </div>
      </div>
      <div className="hero-image">
        <img src={image} alt="E-Wallet Illustration"/>
      </div>
    </section>
  </main>
  <Footer></Footer>
    </>
  )
}

export default Index;