import React, { useEffect } from "react";
import { Box } from "../UtilComponents/Box";
import { Card, CardTitle, Button } from "../UtilComponents"
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

/*
Dear Vin,
Now we put in a link for the curriculum and
a button to start the application. 
And a button to 
Put a place to edit
first and lastname.
Make the user circle open a modal that has a logout button and a preferences button.
*/

const Img = styled.img`
  width: 200px;
  ${whenSmallScreen`
    width: 100vw;
  `}
`;
const Container = styled(Box)``;

const RegisterLink = styled.a`
  ${font}
  text-decoration: none;
  display: inline-block;
  text-align: center;
  padding: 10px;
  color: white;
  background-color: ${cieOrange};
  border-radius: 2px;

  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  align-self: center;
`;

const DownloadAndApplyBox = Box;

export const NextSteps = ({ appStore, cieApi, setMilestone }) => {
  useEffect(() => setMilestone("Solicitud"));
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
            Bienvenidos! Averíguate más sobre nuestro curso WebApp Development -
            Basic y solicita una plaza.
          </P>
        </Box>
      </Box>

      <Card p={3} mb={4} display="flex" flexDirection="column" flexWrap="wrap">
        <H2 textAlign="center" fontSize={[2, 3]} mb={3}>
          Próximos Pasos
        </H2>
        <DownloadAndApplyBox display="flex" justifyContent="center" alignItems="center">
          <P mr={3}> Descarga el currículo de WebApp Development - Basic</P>
          <Button
            onClick={() =>
              saveAs(
                "https://cie-assets.nyc3.cdn.digitaloceanspaces.com/WebApp%20Development%20-%20Basic%20(ES).pdf",
                "WebAppDevelopment_Basic_CIE_2021_Sep_20.pdf"
              )
            }
          >
            <FaDownload /> Descarga el currículo
          </Button>
        </DownloadAndApplyBox>

        <BasicCourseForm cieApi={cieApi} appStore={appStore} />
      </Card>
      <P>
        Quieres hablar en persona? Estamos a tu disponibilidad. Sientete libre
        para{" "}
        <a href="https://calendly.com/coding_in_english">
          programar una reunion de video
        </a>
      </P>
    </Container>
  );
};
