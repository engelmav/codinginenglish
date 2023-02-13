import React, { useState } from "react";
import { render } from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Aula } from "./aula/Aula";

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  useState(false);
  return (
    <>
      <button
        onClick={() => (isAuthenticated ? logout() : loginWithRedirect())}
      >
        {isAuthenticated ? "Logout" : "Login"}
      </button>
      {isAuthenticated && <Aula />}
    </>
  );
};
const App = () => {
  return (
    <Auth0Provider
      domain="login.codinginenglish.com"
      clientId="pyJiq82f4s6ik5dr9oNnyryW5127T965"
      redirectUri={window.location.origin}
    >
      <LoginButton />
    </Auth0Provider>
  );
};

const rootElement = document.getElementById("react-app");
render(<App />, rootElement);
