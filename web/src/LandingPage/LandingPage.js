import React from "react";
import {
  AutoScaleImage,
  Main,
  ContentSection,
  RegisterLink,
} from "../UtilComponents";
import { TitleH1, H2, P } from "../UtilComponents/Typography/Typography";
import BlockQuote from "../UtilComponents/BlockQuote";
import { darkGray, debugBorder } from "../UtilComponents/sharedStyles";
import styled from "styled-components";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const RegisterCtaButton = ({ buttonText, gaLabel }) => (
  <RegisterLink
    width={["45%", "250px", "250px", "250px"]}
    mt={2}
    py={3}
    px={4}
    mb={3}
    alignSelf="center"
    href="/apply"
    onClick={() => {
      ReactGA.event({
        category: "registration",
        action: "clickedRegister",
        label: gaLabel,
      });
    }}
  >
    {buttonText}
  </RegisterLink>
);

const Section = ({
  sectionTitle,
  sectionContent,
  imageData,
  buttonData,
  settings,
}) => {
  // temporary hack till we normalize the 3-tech image.
  let maxWidth = "230px";
  let minWidth = null;
  let className = "img"
  if (imageData.alt === "Software Stack") {
    maxWidth = "500px";
    minWidth = "280px"
  }
  return (
    <ContentSection mt={[1, 5, 5, 5]} mb={4}>
      <AutoScaleImage
        mt={3}
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
      {buttonData && <RegisterCtaButton {...buttonData} />}
    </ContentSection>
  );
};



const LandingPage = (props) => {
  const { settings, landingPageContent } = props;
  const content = landingPageContent;
  return (
    <>
    
      <ContentSection display="flex" flexDirection="column" textAlign="center">
        <TitleH1 my={[3, 5, 5, 5]}>{content.title}</TitleH1>
        <P fontSize={[3, 3, 3, 4, 5]}>{content.subtitle}</P>
      </ContentSection>
      {content.Section.map((section, idx) => (
        <Section key={idx} {...section} settings={settings} />
      ))}
      <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
        <P>
          «Como estudiante extranjero, aprender sobre cualquier materia… era muy
          duro. Para aprender, primero necesitaba comprender una herramienta
          básica: el inglés».
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
  );
};

export default LandingPage;
