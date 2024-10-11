import AuthFormParent from "../components/Auth/Parent";
import Loader from "../components/CrossApp/Loader";
import { Link } from "react-router-dom";
import { GoogleLogo } from "@phosphor-icons/react";
import { useAuthenticate } from "../hooks/useAuth";
import React, { useState } from "react";
import { SignUpUser } from "../utils/@types";
import { enqueueSnackbar } from "notistack";

const SignUp = () => {
  const [user, setUser] = useState<SignUpUser | null>(null);

  const { signup, isPending } = useAuthenticate();

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
            minLength={2}
            maxLength={64}
          />
        </div>
        <div className="wrap__inputs">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            name="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            minLength={6}
            maxLength={16}
          />
        </div>
        <div className="wrap__inputs">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Adresse e-mail"
            name="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <button
          type="button"
          className="submit__button"
          onClick={() => {
            if (!user?.email || !user?.password || !user?.name)
              return enqueueSnackbar("Données invalides ou incomplètes !");

            signup(user);
          }}
        >
          {isPending ? <Loader height={20} width={20} /> : "Créer un compte"}
        </button>
        <span className="switch__auth__pages">
          Vous avez déjà un compte ?{" "}
          <Link to="/client/auth/login">Connectez-le</Link> !
        </span>
      </form>
    </AuthFormParent>
  );
};

export default SignUp;
