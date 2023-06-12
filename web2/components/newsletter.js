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

export const NewsletterForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitState, setSubmitState] = useState("notStarted");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;

    try {
      setSubmitState("loading");
      await axios.post(
        "https://cie-edge-functions-engelmav.vercel.app/api/hello",
        { name, email }
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
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <FormGroup>
              <Input
                type="text"
                name="name"
                placeholder="Introduce tu nombre..."
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                placeholder="Introduce tu email..."
                required
              />
            </FormGroup>
            {submitState === "notStarted" && (
              <Button type="submit">Suscríbete</Button>
            )}
            {submitState === "loading" && (
              <SpinnerContainer>
                <Spinner></Spinner>
              </SpinnerContainer>
            )}
          </InputWrapper>
        </form>
      )}
    </FormWrapper>
  );
};
