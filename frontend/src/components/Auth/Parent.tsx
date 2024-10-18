import React from "react";
import "../../assets/scss/styles/authPage.scss";
import Auth from "../../assets/illustrations/Auth";
import { Link } from "react-router-dom";
import { House } from "@phosphor-icons/react";

const AuthFormParent = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="auth__page__structure">
      <div className="form__card">
        <Link to="/" className="back__homepage">
          <House size={20} />
        </Link>
        <div className="illustration">
          <Auth width="300" height="300"></Auth>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthFormParent;
