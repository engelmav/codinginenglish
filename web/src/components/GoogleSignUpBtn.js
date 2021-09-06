import React, { Component } from "react";
import styled from "styled-components";
import { boxy } from "../UtilComponents";
import GoogleLogin from "react-google-login";

const GoogleBtn = styled.button`
  ${boxy}
  width: 100%;
  border-width: 0px;
  color: white;
  background: #4285f4;
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: flex-start;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  p {
    margin-left: 24px;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
`;

const GImage = styled.img`
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 2.8em;
`;

const GoogleLoginComponent = ({ onLogin, buttonStyles }) => {
  return (
    <GoogleLogin
      render={(renderProps) => (
        <GoogleBtn p={[1, null, 0]} {...buttonStyles} type="button" onClick={renderProps.onClick}>
          <GImage
            height="90%"
            className="google-icon"
            src="https://cie-assets.nyc3.digitaloceanspaces.com/btn_google_dark_normal_ios.svg"
          />
          <p>Inscríbeme con Google</p>
        </GoogleBtn>
      )}
      clientId="528855637927-k112im793kk6l423ctbbfveg3thhs6uv.apps.googleusercontent.com"
      buttonText="Inscríbeme con Google"
      onSuccess={onLogin}
      onFailure={(res) => console.log("google login failed:", res)}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginComponent;
