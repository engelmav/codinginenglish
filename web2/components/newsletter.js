import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";
import React from "react"

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #333333;
  padding: 40px;
  @media (max-width: 768px) {
    margin: 0 -15px; 
  }
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  background-color: transparent;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  gap: 10px;
  background-color: #333333;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  background-color: transparent;
`;

export const Input = styled.input`
  padding: 10px;
  border: none;
  outline: none;
  font-size: 1rem;
  width: 100%;
  color: #ffffff;
  background-color: black;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color:#FF4136
;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s;
  box-sizing: border-box;
  border-radius: 5px;
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
      setSubmitted(true);
    } catch (error) {
      console.error(error);
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