import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AlertMessage,
  TextInput,
  Button,
  Main,
  Box,
  Title,
  Card,
  CardTitle,
  CardContent,
} from "../UtilComponents";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";
import { space } from "styled-system";
import { FaEnvelope } from "@react-icons/all-files/fa/FaEnvelope";
import { Spinner } from "../UtilComponents";
import * as yup from "yup";
import Router from "next/router";
import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const emailSchema = yup.object({ email: yup.string().email() });

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

const GImage = styled.img`
  padding-left: 2px;
  padding-top: 2px;
  padding-bottom: 2px;
  width: 2.8em;
`;
const GoogleBtn = styled.button`
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

const Register = ({ Timeline, appStoreLazy, authLazy, cieApi }) => {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function init() {
      const _auth = await authLazy.create();
      setAuth(_auth);
      const _appStore = await appStoreLazy.load();
      _appStore.setMilestone("Regístrate");
    }
    init();
  }, []);

  const createRegisteredUser = (userEmail) =>
    cieApi.createRegisteredUser({ email: userEmail });

  const handleSubmitEmail = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (email === "") {
      setInvalidEmail(true);
      return;
    }
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
    } catch {
      setInvalidEmail(true);
      ReactGA.event({
        category: "register",
        action: "emailRegistration",
        label: "emailValidationFailed",
      });
      return;
    }
    (await appStoreLazy.load()).flow = "newRegistration";
    handleSetEmailSubmitted();
  };
  const handleSetEmailSubmitted = async () => {
    createRegisteredUser(email);
    ReactGA.event({
      category: "register",
      action: "emailRegistration",
      label: "emailCaptured",
    });
    // const handleLoginResult = (err, res) => {
    //   if (err) {
    //     setInvalidEmail(true);
    //   }
    //   if (res) {
    //     createRegisteredUser(email);
    //     handleSetEmailSubmitted();
    //   }
    // };
    // send the passwordless link to the user so they have an email reference to
    // coding in english and a "way back in".
    auth.loginWithEmailLink(email);
    setIsSending(true);
    (await appStoreLazy.load()).email = email;
    setTimeout(async function () {
      setIsSending(false);
      setEmailSubmitted(true);
      Router.push("/apply/next-steps");
    }, 1500);
  };
  return (
    <>
      <Timeline milestone="Regístrate" />
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
              onClick={async () => {
                const appStore = await appStoreLazy.load();
                appStore.flow = "newRegistration";
                const createRegisteredUserFromGoogleLogin = (auth0Result) => {
                  debugger;
                  createRegisteredUser(email);
                };
                ReactGA.event({
                  category: "register",
                  action: "googleRegistration",
                  label: "googleRegistration",
                });
                auth.loginWithGoogle(
                  { isRegistration: true },
                  createRegisteredUserFromGoogleLogin
                );
              }}
              type="button"
            >
              <GImage
                height="90%"
                className="google-icon"
                src="https://cie-assets.nyc3.digitaloceanspaces.com/btn_google_dark_normal_ios.svg"
              />
              <p>Regístrate con Google</p>
            </GoogleBtn>
            <Divider mt={3} mb={3}>
              o
            </Divider>

            {emailSubmitted ? (
              <P>
                Enviado! Por favor verifica tu correo electrónico (de{" "}
                <b>{email}</b>) para un correo de nosotros. Incluirá un enlace
                para acceder al currículo y la solicitud. (No lo ves?{" "}
                <Button
                  m={1}
                  onClick={() => {
                    setEmailSubmitted(false);
                  }}
                >
                  Intenta otra vez
                </Button>
                )
              </P>
            ) : (
              <Box
                as="form"
                display="flex"
                flexDirection="column"
                onSubmit={handleSubmitEmail}
              >
                <TextInput
                  autoComplete="email"
                  mb={2}
                  width="100%"
                  placeholder={"nombre@xyz.com"}
                  value={email}
                  onChange={(e) => {
                    setInvalidEmail(false);
                    setEmail(e.target.value);
                  }}
                />
                {invalidEmail && (
                  <AlertMessage
                    fontSize={1}
                    mb={2}
                    p={1}
                    text="La dirección de correo electrónico no es válido."
                  />
                )}
                {!isSending && (
                  <RegisterBtn type="submit">
                    <FaEnvelope size={20} />
                    <P ml="24px"> Regístrate con Email</P>
                  </RegisterBtn>
                )}
                {isSending && (
                  <Box alignSelf="center">
                    <Spinner color="black" alignSelf="center" />
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </RegisterOptsCard>
        <P p={3}>
          El proceso de matriculación de Coding in English consta de cuatro
          pasos:
        </P>
        <Ol p={0}>
          <li>Registrarse para ver el plan de estudios</li>
          <li>Rellenar la solicitud del curso</li>
          <li>Entrevista con un instructor</li>
          <li>Matrícula para el curso</li>
        </Ol>
        {/*  */}
      </SignInContainer>
    </>
  );
};

export default Register;
