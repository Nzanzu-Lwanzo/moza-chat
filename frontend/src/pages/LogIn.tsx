import AuthFormParent from "../components/Auth/Parent";
import { Link } from "react-router-dom";
import { GoogleLogo } from "@phosphor-icons/react";

const LogIn = () => {
  return (
    <AuthFormParent>
      <form className="actual__form">
        <h2>Se connecter</h2>
        <div className="wrap__inputs">
          <label htmlFor="name">Nom utilisateur</label>
          <input
            type="text"
            id="name"
            placeholder="Nom utilisateur"
            name="name"
          />
        </div>
        <div className="wrap__inputs">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            name="password"
          />
        </div>
        <button type="submit">Se connecter</button>
        <span className="switch__auth__pages">
          Vous n'avez pas de compte ?{" "}
          <Link to="/client/auth/signup">Créez-en</Link> !
        </span>
        <button type="button" className="o__auth__btn">
          <GoogleLogo size={25} />
          <span>Se connecter avec Google</span>
        </button>
      </form>
    </AuthFormParent>
  );
};

export default LogIn;
