import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AlertMessage,
  TextInput,
  Button,
  Main,
  Box,
  boxy,
} from "../UtilComponents";
import { darkGray, whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";
import { flexbox, space, background } from "styled-system";
import { Spinner } from "../UtilComponents";
import * as yup from "yup";
import Router from "next/router";
import ReactGA from "react-ga";
import { cieApi } from "../services/cieApi";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const emailSchema = yup.object({ email: yup.string().email() });

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${boxy}
  ${flexbox}
`;

SignInContainer.defaultProps = {};

const RegisterOptsCard = styled.div`
  ${boxy}
  background-color: ${darkGray};
  ${background}
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  max-width: 600px;
  border-radius: 0px;
  ${whenSmallScreen`
    width: 100%;
  `}
`;

const EmailForm = ({
  onCaptureEmail,
  image,
  blurb,
  submitBtnText,
  styleProps,
  containerStyles,
}) => {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    async function init() {}
    init();
  }, []);

  const createUserEmail = (userEmail) =>
    cieApi.createUserEmail({ email: userEmail });

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
    handleSetEmailSubmitted();
  };
  const handleSetEmailSubmitted = async () => {
    createUserEmail(email);
    ReactGA.event({
      category: "register",
      action: "emailRegistration",
      label: "emailCaptured",
    });
    setIsSending(true);
    setTimeout(async function () {
      setIsSending(false);
      setEmailSubmitted(true);
    }, 1500);
  };
  return (
    <>
      <RegisterOptsCard {...containerStyles}>
        {image && (
          <Box alignSelf="center" mb={3} mt={4}>
            {image}
          </Box>
        )}

        {blurb && blurb}
        <div>
          {emailSubmitted ? (
            <>
              <P data-cy="curric-confirmation-text" color="white">
                ¡Enviado! Por favor verifica tu correo electrónico (de{" "}
                <b>{email}</b>) para un correo de nosotros. Incluirá un enlace
                para acceder al currículo.
              </P>
              <P color="white">
                No lo ves?{" "}
                <Button
                  m={1}
                  onClick={() => {
                    setEmailSubmitted(false);
                  }}
                >
                  Intenta otra vez
                </Button>
              </P>
            </>
          ) : (
            <Box
              as="form"
              display="flex"
              flexDirection="column"
              onSubmit={handleSubmitEmail}
            >
              <TextInput
                data-cy="email-input"
                autoComplete="email"
                p={3}
                mb={3}
                width="100%"
                placeholder={"email"}
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
                <Button type="submit">
                  <P
                    color="white"
                    alignSelf="center"
                    fontSize={[2]}
                    mb={0}
                    mx="1px"
                    p="1px"
                  >
                    {submitBtnText}
                  </P>
                </Button>
              )}
              {isSending && (
                <Box alignSelf="center">
                  <Spinner color="black" alignSelf="center" />
                </Box>
              )}
            </Box>
          )}
        </div>
      </RegisterOptsCard>
    </>
  );
};

export default EmailForm;
