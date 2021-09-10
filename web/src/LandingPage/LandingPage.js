import React, { useEffect, useState } from "react";
import {
  ApplyLink,
  AutoScaleImage,
  Box,
  boxy,
  ContentSection,
} from "../UtilComponents";
import { TitleH1, H2, P, Ul } from "../UtilComponents/Typography/Typography";
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
import {
  typography,
  flexbox,
  layout,
  background,
  boxShadow,
} from "styled-system";
import dynamic from "next/dynamic";
import { useAppStore } from "../stores/appStoreReact";
import { MailingList } from "../components/MailingList"
import { HeroBg } from "../components/HeroBg"

const CurriculumForm = dynamic(() => import("./CurriculumForm"));

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const HeroContent = styled.div`
  ${boxy}
  display: flex;
  flex-direction: column;
  ${flexbox}
  ${typography}
  ${layout}
`;

const iphoneXHeight = "812px";
const AboveFold = styled.div`
  height: calc(100vh - ${({ headerHeight }) => headerHeight}px);
  display: flex;
  flex-direction: column;
  ${boxy}
  max-height: calc(${iphoneXHeight} - ${({ headerHeight }) => headerHeight}px);
  width: 100%; // prevents overflow from 100vw higher up
  background: ${darkGray};
`;

const SectionBg = styled.div`
  ${boxy}
`;
SectionBg.defaultProps = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const contentSectionStyles = {
  py: 5,
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
  setCurricModal,
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
        <ReactMarkdown components={{ p: P, ul: Ul }}>
          {sectionContent}
        </ReactMarkdown>
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
              bg="black"
              href={buttonData[0].href}
              minWidth="250px"
              p="3"
              bg={cieOrange}
              border={`1px solid ${cieOrange}`}
              color="white"
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

const SuscribeContentSection = (
  <SectionBg>
    <ContentSection mt={[1, 4, 4, 4]} mb={4} pt="3" p="4" px="4">
      <MailingList headerStyles={h2Styles}/>
    </ContentSection>
  </SectionBg>
);

const Strong = styled.span`
  /* font-weight: 600; */

  background: linear-gradient(to left, yellow, yellow 100%);
  background-position: 0 100%;
  background-size: 100% 0.1em;
  background-repeat: repeat-x;
`;

const LandingPage = (props) => {
  const { settings, landingPageContent } = props;
  const content = landingPageContent;
  const [isMobileSize, setIsMobileSize] = useState(false);
  const [curricModal, setCurricModal] = useState(false);
  const store = useAppStore();

  const handleScroll = () => {
    // console.log("store.footerHeight", store.footerHeight)
    // if (window.pageYOffset < store.footerHeight) {
    //   console.log("window.pageYOffset < store.footerHeight", window.pageYOffset);
    // } else {
    //   // do the other thing
    // }
  };
  const handleIntersection = () => {};
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };
  useEffect(() => {
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
    const observer = new IntersectionObserver(handleIntersection, options);
    if (store.footerRef?.current) observer.observe(store.footerRef.current);
  }, []);

  return (
    <>
      <AboveFold headerHeight={store.headerHeight}>
        <HeroBg
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundImage={[
            'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/home/nyc-sunrise-400x154px.webp")',
            null,
            'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-1280px.webp")',
          ]}
        >
          <HeroContent
            display="flex"
            textAlign="center"
            justifyContent="center"
            headerHeight={store.headerHeight}
            height={["auto", null, 400]}
          >
            <TitleH1
              px="2"
              textAlign="center"
              fontSize={[4, 6, 7]}
              color="white"
              my="4"
            >
              {content.title}
            </TitleH1>
          </HeroContent>
        </HeroBg>
        <Box
          p="4"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          flex="1"
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
            <P color="white" textAlign="center">Alcanza la carrera de más crecimiento mundial.</P>
            <ApplyLink
              justifySelf="flex-end"
              minWidth="250px"
              p="3"
              bg={cieOrange}
              href="#learnmore"
              color="white"
              border="none"
            >
              Saber cómo
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
        {SuscribeContentSection}
      </div>

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
