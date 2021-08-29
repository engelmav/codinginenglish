import React, { useEffect, useState } from "react";
import {
  ApplyButton,
  AutoScaleImage,
  Main,
  ContentSection,
  Box,
  boxy,
  Button,
} from "../UtilComponents";
import { TitleH1, H2, P } from "../UtilComponents/Typography/Typography";
import BlockQuote from "../UtilComponents/BlockQuote";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { cieOrange } from "../UtilComponents/sharedStyles";
import Modal from "../components/Modal";
import { BiChevronDownCircle } from "@react-icons/all-files/bi/BiChevronDownCircle";
import { fontSize, typography } from "styled-system";
import dynamic from 'next/dynamic'

const CurricDownloadForm = dynamic(() => import('./CurricDownloadForm'))


const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const MobileMain = styled.div`
  ${boxy}
`;

const Section = ({
  sectionTitle,
  sectionContent,
  imageData,
  buttonData,
  settings,
  setCurricModal,
  setRegModal,
}) => {
  // temporary hack till we normalize the 3-tech image.
  let maxWidth = "230px";
  let minWidth = null;
  let className = "img";
  if (imageData.alt === "Software Stack") {
    maxWidth = "500px";
    minWidth = "280px";
  }
  return (
    <ContentSection mt={[1, 5, 5, 5]} mb={4}>
      <AutoScaleImage
        mt={5}
        mb={3}
        maxWidth={maxWidth}
        minWidth={minWidth}
        className={className}
        alignSelf="center"
        loading="lazy"
        alt={imageData.alt}
        srcSet={`${settings.edgeAssets}${imageData.small}, ${settings.edgeAssets}${imageData.large}`}
        src={`${settings.edgeAssets}${imageData.src}`}
      />
      <H2>{sectionTitle}</H2>
      <ReactMarkdown components={{ p: P }}>{sectionContent}</ReactMarkdown>
      {buttonData && (
        <Box
          mt={[3, 4, 4, 5]}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            maxWidth="150px"
            width="100%"
            color={cieOrange}
            bg="white"
            mr="1"
            onClick={() => setCurricModal(true)}
          >
            Envíame el currículo
          </Button>
          <Button
            onClick={() => setRegModal(true)}
            width="100%"
            maxWidth="150px"
            ml="1"
            alignSelf="center"
            onClick={() => {
              ReactGA.event({
                category: "registration",
                action: "clickedRegister",
                label: buttonData.gaLabel,
              });
            }}
          >
            {buttonData.buttonText}
          </Button>
        </Box>
      )}
    </ContentSection>
  );
};

const CallTag = styled.p`
  ${typography}
  color: white;
  text-shadow: 0.8px 0.5px 0.5px black, 0 0 1em black; //, 0 0 0.1em yellow;
  
  `

const HeroBg = styled.div`
  height: 100vh;
  width: 100vw;
  background-size: cover;
  background-image: url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-sm.webp");
`;

const LandingPage = (props) => {
  const { settings, landingPageContent } = props;
  const content = landingPageContent;
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [curricModal, setCurricModal] = useState(false);
  const [regModal, setRegModal] = useState(false);
  // useEffect(() => {
  //   const mql = window.matchMedia("(max-width: 600px");
  //   mql.addEventListener("change", (e) => setIsMobileSize(e.matches))
  // });

  return (
    <>
      {isMobileSize && <MobileMain>mobileSize</MobileMain>}
      {!isMobileSize && (
        <>
          <HeroBg>
            <ContentSection
              display="flex"
              flexDirection="column"
              textAlign="center"
              justifyContent="space-around"
              height="100vh"
              pb={5}
            >
              <TitleH1 fontSize={[5]} my={[0, 5, 5, 5]}>{content.title}</TitleH1>
              <CallTag  color="white"  fontSize={[3, 3, 3, 4, 5]}>{content.subtitle}</CallTag>
              <Box px={4} display="flex" alignItems="space-evenly" flexWrap="wrap">
              <ApplyButton onClick={() => setCurricModal(true)} fontSize={[1]} mb={3} width="100%" py={3}>Envíame el currículo</ApplyButton>
              <ApplyButton onClick={() => setRegModal(true)} fontSize={[1]} backgroundColor="yellow" width="100%" py={3}>Inscríbeme</ApplyButton>

              </Box>
              <Box justifySelf="end">
              <BiChevronDownCircle size={45} color="white" />
              </Box>
            </ContentSection>
          </HeroBg>
          {content.Section.map((section, idx) => (
            <Section
              key={idx}
              {...section}
              settings={settings}
              setCurricModal={setCurricModal}
              setRegModal={setRegModal}
            />
          ))}
          <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
            <P>
              «Como estudiante extranjero, aprender sobre cualquier materia… era
              muy duro. Para aprender, primero necesitaba comprender una
              herramienta básica: el inglés».
            </P>
            <footer>
              —Takeishi Kimoto,{" "}
              <cite>
                <a href="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
                  ¿De verdad es tan importante saber inglés para aprender
                  programación?
                </a>
              </cite>
            </footer>
          </BlockQuote>
        </>
      )}
      {curricModal && (
        <Modal title="Envíame el currículo!"  onClose={() => setCurricModal(false)}>
          <CurricDownloadForm styleProps={{mt: [0], pt: 0, alignSelf: "center"}} />
        </Modal>
      )}
      {regModal && <Modal onClose={() => setRegModal(false)}>Reg Modal</Modal>}
    </>
  );
};

export default LandingPage;
