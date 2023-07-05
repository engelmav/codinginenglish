import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";
import React from "react";
import {
  Button,
  FormGroup,
  FormWrapper,
  Input,
  InputWrapper,
  P,
} from "./forms";

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Spinner = styled.div`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
    content: "";
    box-sizing: border-box;
    position: absolute;

    width: 20px;
    height: 20px;

    // margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border: 2px solid #ccc;
    border-top-color: #000;
    animation: spinner 0.6s linear infinite;
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  background-color: transparent;
`;
const ConsentButton = styled.button`
  flex: 1;
  padding: 0.3em;
  border: 1px solid #000;
  background-color: #fff;
  color: #000;
  font-size: 1rem;
  cursor: pointer;
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;
// a React component that has a yes and a no button that, each of which are rectangular. when they are selected, the background is black and the text is white. these two buttons function like a radio group
export const RadioGroup = ({ options, selectedOption, setSelectedOption }) => {
  // flex container that makes the buttons contained within span the full width of the container

  // flex button that expands to fill container

  return (
    <Container>
      {options.map((option) => {
        const isSelected = selectedOption === option;
        return (
          <ConsentButton
            key={option}
            onClick={() => setSelectedOption(option)}
            style={{
              backgroundColor: isSelected ? "#000" : "#fff",
              color: isSelected ? "#fff" : "#000",
            }}
          >
            {option}
          </ConsentButton>
        );
      })}
    </Container>
  );
};

// styled component for "Consientor ecibir noticias de Coding in English"
const Consent = styled.p`
  color: #ffffff;
  font-size: 0.8em;
  text-align: center;
`;

export const NewsletterForm = () => {
  const [submitState, setSubmitState] = useState("notStarted");
  const [selectedOption, setSelectedOption] = useState(null);
  const [consentRequired, setConsentRequired] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (selectedOption !== "Sí") {
      setConsentRequired(true);
      return;
    }

    try {
      setSubmitState("loading");
      await axios.post(
        "https://cie-edge-functions-engelmav.vercel.app/api/hello",
        { name: fullName, email }
      );
      setSubmitState("completed");
    } catch (error) {
      setSubmitState("completed"); // silently fail
      console.error(error);
    }
  };

  return (
    <FormWrapper>
      <Title>Suscríbete para mantanerte al tanto</Title>
      {submitState === "completed" ? (
        <P>¡Gracias por suscribirte!</P>
      ) : (
        <>
          <InputWrapper>
            <FormGroup>
              <Input
                type="text"
                name="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Introduce tu nombre"
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Introduce tu email"
                required
              />
            </FormGroup>
            <Consent>Consiento recibir notícias de Coding in English</Consent>
            <RadioGroup
              options={["No", "Sí"]}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
            {submitState === "notStarted" && (
              <Button onClick={() => handleSubmit()}>
                Suscríbete
              </Button>
            )}
            {submitState === "loading" && (
              <SpinnerContainer>
                <Spinner></Spinner>``
              </SpinnerContainer>
            )}
            {consentRequired && (
              <P>
                Si deseas recibir noticias, debes aceptar el consentimiento al
                seleccionar "Sí" o "No"
              </P>
            )}
          </InputWrapper>
        </>
      )}
    </FormWrapper>
  );
};
