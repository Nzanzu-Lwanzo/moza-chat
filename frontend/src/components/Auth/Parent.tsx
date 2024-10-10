import React from "react";
import "../../assets/scss/styles/authPage.scss";
import Auth from "../../assets/illustrations/Auth";

const AuthFormParent = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="auth__page__structure">
      <div className="form__card">
        <div className="illustration">
          <Auth width="300" height="300"></Auth>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthFormParent;
