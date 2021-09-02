import React, { useEffect, useState } from "react";
import { Box, boxy } from "../UtilComponents/Box";
import { Card, CardTitle, Button } from "../UtilComponents";
import { H2, P, TitleH1 } from "../UtilComponents/Typography/Typography";
import styled from "styled-components";
import { cieOrange } from "../UtilComponents/sharedStyles";
import { BasicCourseForm } from "./BasicCourse";

import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);


const Container = styled.div`
  ${boxy}
`;



const RegistrationForm = ({ cieApi }) => {
  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        textAlign="center"
        ml="3"
        mr="3"
      >
        <TitleH1 mt={[3, 3, 4, 4, 5]} textAlign="center">
          WebApp Development
        </TitleH1>
        <H2 color={cieOrange} mt={[0]}>
          Basic Course
        </H2>

        <P fontWeight="bold" fontSize="1" fontStyle="italic" mt={[3, 5]} textAlign="center">
          Aprende a programar mientras aprendes inglés
        </P>
        <BasicCourseForm cieApi={cieApi} />
      </Container>
    </>
  );
};

export default RegistrationForm;
