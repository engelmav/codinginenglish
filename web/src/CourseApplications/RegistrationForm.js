import React, { useEffect, useState } from "react";
import { Timeline } from "./Timeline";
import { Box, boxy } from "../UtilComponents/Box";
import { Card, CardTitle, Button } from "../UtilComponents";
import { P, TitleH1 } from "../UtilComponents/Typography/Typography";
import styled from "styled-components";
import {
  cieOrange,
  font,
  whenSmallScreen,
} from "../UtilComponents/sharedStyles";
import { saveAs } from "file-saver";
import { FaDownload } from "@react-icons/all-files/fa/FaDownload";
import { BasicCourseForm } from "./BasicCourse";

import ReactGA from "react-ga";
import { typography } from "styled-system";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const DownloadAndApplyBox = styled.div`
  ${boxy}
`;

const Container = styled.div`
  ${boxy}
`

const RegistrationForm = ({ appStoreLazy, cieApi }) => {
  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        ml="3"
        mr="3"
      >
        <TitleH1 my={[3, 3, 4, 4, 5]} textAlign="center">
          WebApp Development
        </TitleH1>  


          <CardTitle fontSize={[3, 4, 4, 4, 4]} textAlign="center">
            INSCRIPCIÓN
          </CardTitle>
          <P mb={4} textAlign="center">
            <i>del 20 septiembre al 20 diciembre</i>
          </P>
          <BasicCourseForm cieApi={cieApi} appStoreLazy={appStoreLazy} />


        <P  mt={0} mb={0} my={5} textAlign="center">
          ¿Quieres hablar en persona? No dudes en{" "}
        <a href="https://calendly.com/coding_in_english">
            programar una reunión de video
          </a>
        </P>

      </Container>
    </>
  );
};

export default RegistrationForm;
