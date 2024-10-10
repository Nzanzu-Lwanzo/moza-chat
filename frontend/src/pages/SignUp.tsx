import AuthFormParent from "../components/Auth/Parent";
import Loader from "../components/CrossApp/Loader";
import { Link } from "react-router-dom";
import { GoogleLogo } from "@phosphor-icons/react";

const SignUp = () => {
  return (
    <AuthFormParent>
      <form className="actual__form">
        <h2>Créer un compte</h2>
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
        <div className="wrap__inputs">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Adresse e-mail"
            name="email"
          />
        </div>
        <button type="submit">
          <Loader height={20} width={20} />
        </button>
        <span className="switch__auth__pages">
          Vous avez déjà un compte ?{" "}
          <Link to="/client/auth/login">Connectez-le</Link> !
        </span>
        <button type="button" className="o__auth__btn">
          <GoogleLogo size={25} />
          <span>Se connecter avec Google</span>
        </button>
      </form>
    </AuthFormParent>
  );
}

export default SignUp