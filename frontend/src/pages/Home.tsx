import "../assets/scss/styles/home.scss";
import { Link } from "react-router-dom";
import Chat from "../assets/illustrations/Chat";

const Home = () => {
  return (
    <main className="home__page">
      <section className="banner">
        <header>
          <Link to="/client/auth/login" className="btn">
            Log In
          </Link>
          <Link to="/client/auth/signup" className="btn">
            Sign Up
          </Link>
        </header>
        <div className="banner__text">
          <div className="text">
            <h1>Moza Chat</h1>
            <p>Des inconnus qui deviennent des amis, bienvenue sur l'application de chat que vous avez toujours voulu avoir !</p>
            <Link to="/chat" className="cta">Aller au Chat</Link>
          </div>
          <div className="wrap__illustration">
            <Chat width="250" height="250" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
