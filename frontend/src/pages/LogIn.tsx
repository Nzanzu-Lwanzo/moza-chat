import AuthFormParent from "../components/Auth/Parent";
import { Link } from "react-router-dom";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuthenticate } from "../hooks/useAuth";
import React, { useState } from "react";
import { LogInUser } from "../utils/@types";
import { enqueueSnackbar } from "notistack";
import Loader from "../components/CrossApp/Loader";

const LogIn = () => {
  const [user, setUser] = useState<LogInUser | null>(null);
  const { login, isPending } = useAuthenticate();

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
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="wrap__inputs">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            name="password"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>
        <button
          type="button"
          className="submit__button"
          onClick={() => {

            if (!user?.name || !user?.password)
              return enqueueSnackbar("Données invalides ou incomplètes !");

            login(user);
          }}
        >
          {isPending ? <Loader height={20} width={20} /> : "Se connecter"}
        </button>
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
