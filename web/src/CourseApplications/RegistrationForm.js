import React, { useEffect, useState } from "react";
import { Box, boxy } from "../UtilComponents/Box";
import { Card, CardTitle, Button } from "../UtilComponents";
import { H2, P, TitleH1 } from "../UtilComponents/Typography/Typography";
import styled from "styled-components";
import { cieOrange, lightCieOrangeBg } from "../UtilComponents/sharedStyles";
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
        justifyContent="space-evenly"
        alignItems="center"
        textAlign="center"
      >
        <TitleH1 mt={[3, 3, 4, 4, 5]} textAlign="center">
          WebApp Development
        </TitleH1>
        <H2 color={cieOrange} mt={[3]}>
          Basic Course
        </H2>

        <P mt="3" fontSize="1" fontStyle="italic" textAlign="center">
          Plazas limitadas. Inscríbete ahora.
        </P>
        <Box p="3" mt="3" backgroundColor={lightCieOrangeBg}>
          <BasicCourseForm cieApi={cieApi} containerStyles={{bg: "transparent"}}/>
        </Box>
      </Container>
    </>
  );
};

export default RegistrationForm;
