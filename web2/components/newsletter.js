import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";
import React from "react"

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1a1a1a;
  padding: 40px;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 10px;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  background-color: #333333;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #ffffff;
  background-color: transparent;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff5f5f;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;

  &:hover {
    background-color: #ff8a8a;
  }
`;

const P = styled.p`
  color: yellow;
`

export const NewsletterForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;

    try {
      await axios.post("https://cie-edge-functions-engelmav.vercel.app/api/hello", { name, email });
      // Add any necessary success handling logic here
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      // Add any necessary error handling logic here
    }
  };

  return (
    <FormWrapper>
      <Title>Suscríbete para mantanerte al tanto</Title>
      {submitted ? (
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
            <Button type="submit">Suscríbete</Button>
          </InputWrapper>
        </form>
      )}
    </FormWrapper>
  );
};