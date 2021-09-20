import React, { useState } from "react";
import {
  ApplyLink,
  AutoScaleImage,
  Box,
  boxy,
  ContentSection,
} from "../UtilComponents";
import { H2, P, TitleH1, Ul } from "../UtilComponents/Typography/Typography";
import BlockQuote from "../UtilComponents/BlockQuote";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import {
  cieOrange,
  lightCieOrangeBg,
  darkGray,
} from "../UtilComponents/sharedStyles";
import Modal from "../components/Modal";
import { background } from "styled-system";
import dynamic from "next/dynamic";
import { useAppStore } from "../stores/appStoreReact";
import { Hero } from "../components/Hero";
import useInView from "react-cool-inview";

const CurriculumForm = dynamic(() => import("./CurriculumForm"));
const MailingList = dynamic(() => import("../components/MailingList"));

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const iphoneXHeight = "812px";
const AboveFold = styled.div`
  height: calc(100vh - ${({ headerHeight }) => headerHeight}px);
  display: flex;
  flex-direction: column;
  ${boxy}
  width: 100%; // prevents overflow from 100vw higher up
  background: ${darkGray};
`;

const SectionBg = styled.div`
  ${boxy}
  ${background}
`;
SectionBg.defaultProps = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const contentSectionStyles = {
  py: 4,
  pt: 5,
  px: [4],
};

const h2Styles = { pt: 0, mt: 0, mt: 4, mb: 4, color: darkGray };

const Section = ({
  sectionTitle,
  sectionContent,
  idx,
  imageData,
  buttonData,
  settings,
}) => {
  // temporary hack till we normalize the 3-tech image.
  let maxWidth = "230px";
  let minWidth = null;
  let className = "img";
  if (["Software Stack", "Get Jobs"].includes(imageData.alt)) {
    maxWidth = "500px";
    minWidth = "280px";
  }
  let contentSectionStyleProps = {};
  let headerProps = {};
  if (idx % 2 === 0) {
    contentSectionStyleProps.bg = lightCieOrangeBg;
  } else {
    headerProps.color = "white";
    contentSectionStyleProps.background =
      "linear-gradient(to bottom, #7927b2, #fb3182)";
  }
  return (
    <SectionBg {...contentSectionStyleProps}>
      <ContentSection {...contentSectionStyles} width="100%">
        <AutoScaleImage
          maxWidth={maxWidth}
          minWidth={minWidth}
          className={className}
          alignSelf="center"
          loading="lazy"
          alt={imageData.alt}
          srcSet={`${settings.edgeAssets}${imageData.small}, ${settings.edgeAssets}${imageData.large}`}
          src={`${settings.edgeAssets}${imageData.src}`}
        />
        <H2 {...h2Styles} {...headerProps}>
          {sectionTitle}
        </H2>
        <ReactMarkdown
          children={sectionContent}
          components={{
            p: ({ node, ...props }) => (
              <P
                {...headerProps}
                fontSize={[2, 2, 2, 3, 3]}
                pb="0"
                mb="4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <H2
                {...headerProps}
                background="yellow"
                mb="2"
                textAlign="left"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <Ul {...headerProps} mb="2" textAlign="left" {...props} />
            ),
          }}
        />
        {buttonData && (
          <Box
            mt={[3, 4, 4, 5]}
            width="100%"
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            justifyContent="center"
          >
            <ApplyLink
              href={buttonData[0].href}
              minWidth="250px"
              p="3"
              bg="yellow"
              color="black"
              onClick={() => {
                ReactGA.event({
                  category: "landingPage",
                  action: buttonData[0].gaAction,
                  label: buttonData[0].gaLabel,
                });
              }}
            >
              {buttonData[0].buttonText}
            </ApplyLink>
          </Box>
        )}
      </ContentSection>
    </SectionBg>
  );
};

const Strong = styled.span`
  /* font-weight: 600; */

  background: linear-gradient(to left, yellow, yellow 100%);
  background-position: 0 100%;
  background-size: 100% 0.1em;
  background-repeat: repeat-x;
`;

const LandingPage = (props) => {
  const { settings, landingPageContent, mailingListComponentContent } = props;
  const content = landingPageContent;
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [curricModal, setCurricModal] = useState(false);
  const store = useAppStore();

  const { observe, inView } = useInView();

  return (
    <>
      <AboveFold headerHeight={store.headerHeight}>
        {/* <Hero
          heroHeight={["35%", "60%"]}
          heroText={content.title}
          imageSrc="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-1280px.webp"
          imageSrcSet="https://cie-assets.nyc3.cdn.digitaloceanspaces.com/home/nyc-sunrise-400x154px.webp 720w, https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-1280px.webp 1920w"
        /> */}
        <Box
          display="flex"
          width="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="45%"
        >
          <TitleH1 fontSize={[4, 6, 7]} textAlign="center" color="white">
            {content.title}
          </TitleH1>
          <TitleH1>🚀</TitleH1>
        </Box>
        <Box
          height="55%"
          p="4"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          background="linear-gradient(to bottom, #7927b2, #fb3182)"
        >
          <Box
            display="flex"
            flexDirection="column"
            flex="1"
            justifyContent="center"
          >
            <ReactMarkdown
              children={content.subtitle}
              components={{
                p: ({ node, ...props }) => (
                  <P
                    color="white"
                    textAlign="center"
                    fontSize={[3, 4, 4, 5, 5]}
                    pb="0"
                    mb="0"
                    {...props}
                  />
                ),
                strong: ({ node, ...props }) => <Strong {...props} />,
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            flex="1"
            justifyContent="space-evenly"
          >
            <P color="white" textAlign="center">
              {content.subsubtitle}
            </P>
            <ApplyLink
              justifySelf="flex-end"
              minWidth="250px"
              p="3"
              bg={cieOrange}
              href="#learnmore"
              color="black"
              border="none"
              bg="yellow"
              onClick={() => {
                ReactGA.event({
                  category: "landingPage",
                  action: "clicked See How",
                  label: "See how button",
                });
              }}
            >
              {content.heroCta1}
            </ApplyLink>
          </Box>
        </Box>
      </AboveFold>
      <div style={{ width: "100%" }} id="learnmore">
        {content.Section.map((section, idx) => (
          <Section
            key={idx}
            idx={idx}
            {...section}
            settings={settings}
            setCurricModal={setCurricModal}
          />
        ))}
      </div>
      <Box mt="4" maxWidth="400px">
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
      </Box>
      <SectionBg ref={observe}>
        <ContentSection mb="5" px="4" maxWidth="550px">
          {inView && (
            <MailingList
              headerStyles={h2Styles}
              content={mailingListComponentContent}
            />
          )}
        </ContentSection>
      </SectionBg>
      {curricModal && (
        <Modal
          styleProps={{ mt: [3, 5, 5, 6] }}
          title={content.Modal1.title}
          onClose={() => setCurricModal(false)}
        >
          <CurriculumForm content={content.Modal1} />
        </Modal>
      )}
    </>
  );
};

export default LandingPage;
