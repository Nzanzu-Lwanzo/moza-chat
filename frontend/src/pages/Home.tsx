import "../assets/scss/styles/home.scss";
import { Link } from "react-router-dom";
import Chat from "../assets/illustrations/Chat";
import useAppStore from "../stores/AppStore";

const Home = () => {
  const auth = useAppStore((state) => state.auth);

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
            <p>
              Des inconnus qui deviennent des amis, bienvenue sur l'application
              de chat que vous avez toujours voulu avoir !
            </p>
            <Link to={auth ? "/chat" : "/client/auth/login"} className="cta">
              Aller au Chat
            </Link>
          </div>
          <div className="wrap__illustration">
            <Chat width="250" height="250" />
          </div>
        </div>
      </section>

      <section className="content" id="about">
        <h1>Au sujet de Moza Chat</h1>
        <p>
          <strong>Moza Chat</strong> est une application Web de Chat en temps
          réel développée par{" "}
          <Link to="https://github.com/Nzanzu-Lwanzo">NZANZU MUHAYRWA L.</Link>,
          programmeur et écrivain.
        </p>

        <h2>Comment Moza Chat fonctionne ?</h2>
        <p>
          Moza Chat permet aux utilisateurs de créer et/ou joindre des Chat
          Rooms. Une Chat Room, c'est comme un groupe que les gens peuvent
          rejoindre pour chatter. <br />
          Il existe deux types de Chat Room :
        </p>
        <ul>
          <li>
            <p>
              <strong>Chat Room Privée</strong> : c'est une Chat Room qui n'est
              pas visible par le grand public. On ne peut y accéder que si le
              créateur lui-même nous y a ajouté.
            </p>
          </li>
          <li>
            <p>
              <strong>Chat Room Publique</strong> : c'est une Chat Room qui est
              visible par le grand public. Il suffit de le rejoindre et de
              commencer à chater.
            </p>
          </li>
        </ul>

        <h2>Confidentialité de données</h2>
        <p>
          Moza Chat requiert que vous ayez un compte. Toutes vos données sont
          stockées sur un cluster securisé et vous avez la possibilité de les
          supprimer quand vous vouler, les modifier quand vous voulez. De plus,
          vous avez la liberté de quitter une Chat Room quand vous voulez, sans
          que personne ne le sache. Et vous pouvez choisir, avant de quitter une
          Chat Room, de supprimer tous les messages que vous aurez envoyés dans
          cette Chat Room.
        </p>

        <h2>Considérations techniques</h2>
        <p>
          Moza Chat fonctionne avec une BDD cloud et une BDD locale c'est-à-dire
          une BDD qui est éloignée de vous (un serveur) et une BDD qui est
          directement sur votre téléphone. Cela pour permettre la rapidité avec
          laquelle vous pouvez accéder aux données dont vous avez besoin très
          souvent (les messages, les rooms, les utilisateurs, ...) et réduire la
          consommation de la bande passant (vos mégas).
          <br />
          S'il arrive pour quelque raison que l'application dysfonctionne,
          rafraîchissez la page (ça marche à tous les coups)!
          <br />
          <br />
          Si le problème persiste, veuillez contacter le développeur à{" "}
          <Link to="mailto:nzanzu.lwanzo.work@gmail.com">
            cette adresse e-mail
          </Link>{" "}
          ou sur ce numéro +243-977-210-519 (Whatsapp et Telegram).
        </p>
      </section>
    </main>
  );
};

export default Home;
