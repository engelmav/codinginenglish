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

const MainLanding = styled(Main)`
  ${debugBorder}
  width: min(90%, 850px);
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;

  p,
  blockquote {
    margin-left: auto;
    margin-right: auto;
    max-width: 700px;
  }

  img.wide-image {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }

  p.sub-heading {
    font-size: 25px;
  }

  @media (max-width: 700px) {
    p.sub-heading {
      font-size: 20px;
      padding-bottom: 0px;
    }
  }

  & .cie-title {
    font-family: monospace;
    font-size: max(1rem, min(2.5rem, 3vw));
  }
  & .section {
    flex-basis: 100%;
  }
`;

const RegisterCtaButton = (props) => (
  <RegisterLink
    width={["100%", "250px", "250px", "250px"]}
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
        label: props.where,
      });
    }}
  >
    ¡inscríbete ahora!
  </RegisterLink>
);

const Section = ({
  sectionTitle,
  sectionContent,
  imageData,
  callToActionButton,
  settings,
}) => {
  return (
    <ContentSection mt={[1, 5, 5, 5]}>
      <AutoScaleImage
        mt={3}
        mb={3}
        alignSelf="center"
        loading="lazy"
        alt={imageData.alt}
        srcSet={`${settings.edgeAssets}${imageData.small}, ${settings.edgeAssets}${imageData.large}`}
        src={`${settings.edgeAssets}${imageData.src}`}
      />
      <H2>{sectionTitle}</H2>
      <ReactMarkdown components={{ p: P }}>{sectionContent}</ReactMarkdown>
      <RegisterCtaButton where="after crea aplicaciones" />
    </ContentSection>
  );
};

const LandingPage = (props) => {
  const { settings, content } = props;
  console.log(content);
  return (
    <MainLanding p={1}>
      <ContentSection display="flex" flexDirection="column" textAlign="center">
        <TitleH1 my={[3, 5, 5, 5]}>{content.title}</TitleH1>
        <P className="sub-heading">{content.subtitle}</P>
      </ContentSection>
      {content.Section.map((section) => (
        <Section {...section} settings={settings} />
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
    </MainLanding>
  );
};

export default LandingPage;
