import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  AlertMessage,
  TextInput,
  Button,
  Box,
  boxy,
} from "../UtilComponents";
import { darkGray, whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";
import { flexbox, space, background, layout } from "styled-system";
import { Spinner } from "../UtilComponents";
import * as yup from "yup";
import ReactGA from "react-ga";
import settings from "../settings"

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
  background-color: ${darkGray};
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

const EmailForm = ({
  onCaptureEmail,
  image,
  blurb,
  submitBtnText,
  styleProps,
  successView,
  onFinishSubmitEmail,
  containerStyles,
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
        category: "register",
        action: "emailRegistration",
        label: "emailValidationFailed",
      });
      return;
    }
    handleSetEmailSubmitted();
  };
  const handleSetEmailSubmitted = async () => {
    onCaptureEmail && onCaptureEmail(email)
    setIsSending(true);
    setTimeout(async function () {
      setIsSending(false);
      setEmailSubmitted(true);
      onFinishSubmitEmail && onFinishSubmitEmail(email);
    }, 1500);
  };
  return (
    <>
      <EmailFormContainer {...containerStyles}>
        {image && (
          <Box alignSelf="center" mb={3} mt={4}>
            {image}
          </Box>
        )}

        {blurb && blurb}
        <>
          {emailSubmitted ? (
            <>
              {successView || <></>}
              {confirmRetry && (
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
              )}
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
        </>
      </EmailFormContainer>
    </>
  );
};

export default EmailForm;
