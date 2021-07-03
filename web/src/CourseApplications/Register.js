import React, { useEffect } from "react";
import styled from "styled-components";
import { TextInput, Button, Main, Title, Box } from "../UtilComponents";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import { P, Ol } from "../UtilComponents/Typography/Typography";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const RegisterBtn = styled(Button)`
  min-width: 250px;
`;

export const Register = ({ appStore, auth, cieApi, setMilestone }) => {
  useEffect(() => {
    setMilestone("Regístrate");
  }, []);
  return (
    <SignInContainer className="signin-container">
      <Title textAlign="center" mt={3} mb={3}>
        Regístrate
      </Title>
      <P mb="8px">
        El proceso de matriculación de Coding in English consta de cuatro pasos:
      </P>
      <Ol mt="8px">
        <li>Registrarse</li>
        <li>Rellenar la solicitud del curso</li>
        <li>Entrevista con un instructor</li>
        <li>Matrícula para el curso</li>
      </Ol>

      <RegisterBtn
        alignSelf="center"
        onClick={() => {
          appStore.flow = "firstRegistration";
          auth.login();
        }}
      >
        Regístrate
      </RegisterBtn>
    </SignInContainer>
  );
};
