import React, { useEffect, useState } from "react";
import { Box, boxy } from "../UtilComponents/Box";
import { Card, CardTitle, Button } from "../UtilComponents";
import { P, Title, H2 } from "../UtilComponents/Typography/Typography";
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

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const Img = styled.img`
  width: 200px;
  ${whenSmallScreen`
    width: 100vw;
  `}
`;
const Container = styled(Box)``;

const DownloadAndApplyBox = styled.div`
  ${boxy}
`;

const NextSteps = ({ appStoreLazy, cieApi }) => {
  const [appStore, setAppStore] = useState(null)
  useEffect(() => {
    async function init() {
      setAppStore(await appStoreLazy.load());
      appStore.milestone = "Solicitud"
    }
    init();
  }, []);
  return (
    <Container
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        mt={4}
        mb={4}
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
        width="100%"
      >
        <Img
          alt="Make it happen!"
          src="https://cie-assets.nyc3.digitaloceanspaces.com/application/make-it-happen-1000px.jpg"
        />
        <Box
          display="flex"
          maxWidth={["100%", 300, 350, 400]}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Title mt={[3, 0]} textAlign="center">
            Solicitud
          </Title>
          <P mt={3} width={[1 / 2, 1]}>
            ¡Bienvenidos! Averíguate más sobre nuestro curso WebApp Development
            - Basic y solicita una plaza.
          </P>
        </Box>
      </Box>

      <Card p={3} mb={3} display="flex" flexDirection="column" flexWrap="wrap">
        <H2 textAlign="center" fontSize={[2, 3]} mb={3}>
          Próximos Pasos
        </H2>
        <DownloadAndApplyBox
          mb={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <P mr={3}>Descarga el currículo de WebApp Development - Basic</P>
          <Button
            onClick={() => {
              ReactGA.event({
                category: "application",
                action: "downloadCurriculum",
                label: "basicCurriculum",
              });
              saveAs(
                "https://cie-assets.nyc3.cdn.digitaloceanspaces.com/WebApp%20Development%20-%20Basic%20(ES).pdf",
                "WebAppDevelopment_Basic_CIE_2021_Sep_20.pdf"
              );
            }}
          >
            <FaDownload /> Descarga el currículo
          </Button>
        </DownloadAndApplyBox>
        <BasicCourseForm cieApi={cieApi} appStore={appStore} />
      </Card>
      <P>
        ¿Quieres hablar en persona? No dudes en{" "}
        <a href="https://calendly.com/coding_in_english">
          programar una reunión de video
        </a>
      </P>
    </Container>
  );
};

export default NextSteps;
