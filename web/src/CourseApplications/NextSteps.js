import React, { useEffect, useState } from "react";
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

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);
const Container = styled(Box)``;

const DownloadAndApplyBox = styled.div`
  ${boxy}
`;

const NextSteps = ({ Timeline, appStoreLazy, cieApi }) => {
  const [appStore, setAppStore] = useState(null);
  useEffect(() => {
    async function init() {
      const _appStore = await appStoreLazy.load();
      _appStore.setMilestone("Solicitud");
      setAppStore(_appStore);
    }
    init();
  }, []);
  return (
    <>
      <Timeline milestone="Solicitud" />
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <TitleH1 my={[3, 3, 4, 4, 5]} textAlign="center">
          WebApp Development
        </TitleH1>
            <DownloadAndApplyBox
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              width={["100%", "90%", 600, "100%"]}
              mb={[4, 4, 4, 4, 5]}
            >
              <P flexGrow="1" width={["100%", "75%", "75%", "75%"]} m={0} p={0}>
                Averíguate más sobre nuestro curso WebApp Development - Basic y
                solicita una plaza.
              </P>
              <Button
              
                width={["100%", "25%", "25%", "25%"]}
                flexGrow="1"
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
  

        <Card
          width={["100%", "90%", 600, "100%"]}
          p={3}
          mb={3}
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
        >
          <CardTitle fontSize={[3, 4, 4, 4, 4]} textAlign="center">
            solicita una plaza
          </CardTitle>
          <P mb={4} textAlign="center">
            <i>del 20 septiembre al 20 diciembre</i>
          </P>
          <BasicCourseForm cieApi={cieApi} appStoreLazy={appStoreLazy} />
        </Card>
        <P>
          ¿Quieres hablar en persona? No dudes en{" "}
          <a href="https://calendly.com/coding_in_english">
            programar una reunión de video
          </a>
        </P>
      </Container>
    </>
  );
};

export default NextSteps;
