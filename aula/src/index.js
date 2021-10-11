import React from "react";
import { render } from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { useAuth0 } from "@auth0/auth0-react";


const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};
const App = () => {
  return (
    <Auth0Provider
      domain="login.codinginenglish.com"
      clientId="pyJiq82f4s6ik5dr9oNnyryW5127T965"
      redirectUri={window.location.origin}
    >
      <LoginButton />
      <div>app</div>
    </Auth0Provider>
  );
};






const rootElement = document.getElementById("react-app");
render(<App />, rootElement);
