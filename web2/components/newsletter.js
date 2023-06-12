import styled from "@emotion/styled";
import axios from "axios";
import { useState } from "react";
import React from "react"
import { Button, FormGroup, FormWrapper, Input, InputWrapper, P } from "./forms";



const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  background-color: transparent;
`;


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