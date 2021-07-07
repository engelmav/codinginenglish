import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TextInput, Button, Main, Title, Box } from "../UtilComponents";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const RegisterBtn = styled(Button)`
  min-width: 250px;
`;

const GoogleBtn = styled.button`
  img {
    padding-left: 2px;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  width: 100%;
  padding: 0;
  margin: 0;
  border-width: 0px;
  color: white;
  background: #4285f4;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:hover {
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  p {
    margin: 0;
    padding: 0;
    margin-left: 24px;
    font-family: "Roboto", sans-serif;
    font-weight: 700;
    font-size: 14px;
  }
`;

const RegisterOpts = styled.div`
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  flex-direction: column;
`;

export const Register = ({ appStore, auth, cieApi, setMilestone }) => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    setMilestone("Regístrate");
  }, []);
  return (
    <SignInContainer className="signin-container">
      <Title textAlign="center" mt={3} mb={3}>
        Regístrate
      </Title>
      <P mb="8px">
        El proceso de matriculación de Coding in English consta de cuatro pasos:
      </P>
      <Ol mt="8px">
        <li>Registrarse</li>
        <li>Rellenar la solicitud del curso</li>
        <li>Entrevista con un instructor</li>
        <li>Matrícula para el curso</li>
      </Ol>
      <RegisterOpts>
        <GoogleBtn
          onClick={() => auth.loginWithEmailLink(email)}
          class="google-btn"
          id="google-btn"
          type="button"
        >
          <img
            height="90%"
            class="google-icon"
            src="https://cie-assets.nyc3.digitaloceanspaces.com/btn_google_dark_normal_ios.svg"
          />
          <p>Regístrate con Google</p>
        </GoogleBtn>
        <P m="5px" textAlign="center">- o -</P>
        <TextInput
          placeholder={"nombre@xyz.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <RegisterBtn
          alignSelf="center"
          onClick={() => auth.loginWithEmailLink(email)}
        >
          Regístrate con email
        </RegisterBtn>
      </RegisterOpts>
    </SignInContainer>
  );
};
