import React, { useState, useEffect } from "react";
import { FacebookLoginButton } from "react-social-login-buttons";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

export const FacebookLoginBtn = ({ onLogin }) => {
  const [FB, setFB] = useState(null);
  function componentClicked(clickedArg) {
    console.log("componentClicked:", clickedArg);
  }
  function responseFacebook(resp) {
    console.log("responseFacebook:", resp);
    onLogin(resp);
  }

  return (
    <FacebookLogin
      appId="168871810428685"
      autoLoad={false}
      fields="first_name,last_name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook}
      render={(renderProps) => (
        <FacebookLoginButton
          text="Continúa con Facebook"
          style={{
            margin: 0,
            width: "255px",
            font: "Roboto",
            fontSize: "14px",
            fontWeight: 700,
          }}
          onClick={renderProps.onClick}
        />
      )}
    />
  );
};
