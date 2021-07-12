import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  TextInput,
  Button,
  Main,
  Box,
  Title,
  Card,
  CardTitle,
} from "../UtilComponents";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";
import { space } from "styled-system";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const RegisterBtn = styled(Button)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  p {
    color: white;
    font-weight: 700;
  }
`;

const GoogleBtn = styled.button`
  img {
    padding-left: 2px;
    padding-top: 2px;
    padding-bottom: 2px;
    width: 2.8em;
  }
  width: 100%;
  padding: 0;
  margin: 0;
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

const Divider = styled(P)`
  ${space}
  display: flex;
  align-items: center;
  &:before {
    content: "";
    flex: 1;
    height: 1px;
    margin-right: 1em;
    box-shadow: 0 0.5px 0 black;
  }
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    margin-left: 1em;
    box-shadow: 0 0.5px 0 black;
  }
`;

const RegisterOptsCard = styled(Card)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  width: 600px;
  
  ${whenSmallScreen`
    width: 100%;
  `}
`;
const CardContent = styled.div`
  width: 300px;
  ${whenSmallScreen`
    width: 100%;
  `}
  align-self: center;
  display: flex;
  flex-direction: column;
`;

export const Register = ({ appStore, auth, cieApi, setMilestone }) => {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const handleSetEmailSubmitted = () => {
    // Morning Vin,
    // Here, add a loading spinner to the "Registrate" button.
    // We can also use it for the "Envia" button!
    // Then, move on to fixing up the formatting of the application.
    setTimeout(function() {
      setEmailSubmitted(true)
  }, 2000);
  }
  useEffect(() => {
    setMilestone("Regístrate");
  }, []);
  return (
    <SignInContainer className="signin-container">
      <Title textAlign="center">Regístrate</Title>
      <P p={3}>
        Regístrate aquí para ver el currículo de WebApp Development - Basic y
        solicitar una plaza.
      </P>
      <RegisterOptsCard p={4} mt={3} mb={3}>
        <CardTitle fontSize={1} mb={3} textAlign="center">
          registración
        </CardTitle>
        <CardContent>
          <GoogleBtn
            onClick={() => {
              appStore.flow = "newRegistration";
              auth.loginWithGoogle();
            }}
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
          <Divider mt={3} mb={3}>
            o
          </Divider>

          {(emailSubmitted)
          
          ? <P>Enviado! 
            Por favor verifica tu correo electrónico para un correo de nosotros. Incluirá un enlace para acceder al currículo y la solicitud.</P> 
          : <Box display="flex" flexDirection="column">
          <TextInput
            mb={2}
            width="100%"
            placeholder={"nombre@xyz.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <RegisterBtn
            onClick={() => {
              appStore.flow = "newRegistration";
              auth.loginWithEmailLink(email);
              handleSetEmailSubmitted();
            }}
          >
            <FaEnvelope size={20} />
            <P ml="24px"> Regístrate con Email</P>
          </RegisterBtn>
          </Box>}
        </CardContent>
      </RegisterOptsCard>
      <P mb="8px">
        El proceso de matriculación de Coding in English consta de cuatro pasos:
      </P>
      <Ol mt="8px">
        <li>Registrarse para ver el plan de estudios</li>
        <li>Rellenar la solicitud del curso</li>
        <li>Entrevista con un instructor</li>
        <li>Matrícula para el curso</li>
      </Ol>
      {/*  */}
    </SignInContainer>
  );
};
