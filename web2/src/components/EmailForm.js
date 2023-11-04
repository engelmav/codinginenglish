import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AlertMessage, TextInput, Button, Box, boxy } from "../UtilComponents";
import {
  cieOrange,
  darkGray,
  whenSmallScreen,
} from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";
import { color, flexbox, space, background, layout } from "styled-system";
import { Spinner } from "../UtilComponents";
import * as yup from "yup";
import ReactGA from "react-ga";
import settings from "../settings";
import GoogleLoginComponent from "../components/GoogleSignUpBtn";
import { cieApi } from "../services/cieApi";
import { FacebookLoginBtn } from "./FacebookSignupBtn";

ReactGA.initialize(settings.gaTrackingId);

const emailSchema = yup.object({ email: yup.string().email() });

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  ${boxy}
  ${flexbox}
`;

SignInContainer.defaultProps = {};

const EmailFormContainer = styled.div`
  ${boxy}
  ${layout}
  ${background}
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  ${whenSmallScreen`
    width: 100%;
  `}
`;

const Divider = styled(P)`
  ${space}
  color: white;
  ${color}
  font-family: "Roboto Mono";
  display: flex;
  align-items: center;

  &:before {
    content: "";
    flex: 1;
    height: 1px;
    margin-right: 1em;
    box-shadow: 0 0.5px 0 white;
    background: white;
    ${background};
  }
  &:after {
    ${color}
    content: "";
    flex: 1;
    height: 1px;
    margin-left: 1em;
    box-shadow: 0 0.5px 0 white;
    background: white;
    ${background}
  }
`;

const EmailForm = ({
  onCaptureEmail,
  image,
  blurb,
  buttonStyles,
  showGoogleSignin,
  submitBtnText,
  successView,
  onFinishSubmitEmail,
  onGoogleSignin,
  onFacebookSignin,
  googleBtnText,
  containerStyles,
  dividerStyles,
  gaCategory,
  confirmRetry = false,
}) => {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  useEffect(() => {
    async function init() {}
    init();
  }, []);

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
        category: gaCategory,
        action: "emailRegistration",
        label: "emailValidationFailed",
      });
      cieApi.log(`email validation failed for email ${email}`);
      return;
    }
    handleSetEmailSubmitted();
  };

  const handleSetEmailSubmitted = async () => {
    onCaptureEmail && onCaptureEmail(email);
    setIsSending(true);
    setTimeout(async function () {
      setIsSending(false);
      setEmailSubmitted(true);
      onFinishSubmitEmail && onFinishSubmitEmail(email);
    }, 1500);
  };

  const handleGoogleLogin = async (googleUser) => {
    onGoogleSignin(googleUser);
  };
  const handleFacebookLogin = async (fbLoginResp) => {
    onFacebookSignin(fbLoginResp)
  };
  return (
    <>
      <EmailFormContainer width="255px" {...containerStyles}>
        {image && image}

        {blurb && blurb}
        <>
          {emailSubmitted ? (
            <>
              {successView || <></>}
              {confirmRetry && (
                <P color="white">
                  No lo ves?{" "}
                  <Button
                    border="none"
                    m={1}
                    onClick={() => {
                      setEmailSubmitted(false);
                    }}
                  >
                    Intenta otra vez
                  </Button>
                </P>
              )}
            </>
          ) : (
            <Box display="flex" flexDirection="column">
              {showGoogleSignin && (
                <>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    <Box mb="2">
                      <GoogleLoginComponent
                        onLogin={handleGoogleLogin}
                        buttonText={googleBtnText}
                      />
                    </Box>
                    <FacebookLoginBtn onLogin={handleFacebookLogin} />
                  </Box>
                  <Divider {...dividerStyles} mt={2} mb={2}>
                    o
                  </Divider>
                </>
              )}
              <TextInput
                data-cy="email-input"
                autoComplete="email"
                p={3}
                width="100%"
                placeholder="nombre@dominio.com"
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
                <Button
                  border="none"
                  color="white"
                  mt="2"
                  {...buttonStyles}
                  type="button"
                  onClick={handleSubmitEmail}
                >
                  {submitBtnText}
                </Button>
              )}
              {isSending && (
                <Box alignSelf="center">
                  <Spinner color="black" alignSelf="center" />
                </Box>
              )}
            </Box>
          )}
        </>
      </EmailFormContainer>
    </>
  );
};

export default EmailForm;
