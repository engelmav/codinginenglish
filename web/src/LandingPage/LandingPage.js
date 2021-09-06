import React, { useEffect, useState } from "react";
import {
  ApplyLink,
  AutoScaleImage,
  Box,
  boxy,
  Button,
  ContentSection,
} from "../UtilComponents";
import { TitleH1, H2, P, PH } from "../UtilComponents/Typography/Typography";
import BlockQuote from "../UtilComponents/BlockQuote";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import {
  cieOrange,
  lightCieOrangeBg,
  ciePurpleTemp,
  darkGray,
} from "../UtilComponents/sharedStyles";
import Modal from "../components/Modal";
import { BiChevronDownCircle } from "@react-icons/all-files/bi/BiChevronDownCircle";
import { typography, flexbox, layout, background } from "styled-system";
import dynamic from "next/dynamic";
import { useAppStore } from "../stores/appStoreReact";
import EmailForm from "../components/EmailForm";
import { HappyAlert } from "../components/Alerts";

const CurriculumForm = dynamic(() => import("./CurriculumForm"));

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const MobileMain = styled.div`
  ${boxy}
`;

const HeroContent = styled.div`
  ${boxy}
  display: flex;
  flex-direction: column;

  ${flexbox}
  ${typography}
  ${layout}
`;

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
  if (imageData.alt === "Software Stack") {
    maxWidth = "500px";
    minWidth = "280px";
  }
  let contentSectionStyleProps = {};
  let headerProps = {};
  if (idx % 2 === 0) {
    contentSectionStyleProps.bg = lightCieOrangeBg;
  }
  return (
    <ContentSection
      {...contentSectionStyles}
      {...contentSectionStyleProps}
      width="100%"
    >
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
      <ReactMarkdown components={{ p: P }}>{sectionContent}</ReactMarkdown>
      {buttonData && (
        <Box
          mt={[3, 4, 4, 5]}
          width="100%"
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          justifyContent="center"
        >
          <Button
            {...applyProps}
            bg={"white"}
            color={darkGray}
            onClick={() => {
              setCurricModal(true);
              ReactGA.event({
                category: "landingPage",
                action: buttonData[1].gaAction,
                label: buttonData[1].gaLabel,
              });
            }}
          >
            {buttonData[1].buttonText}
          </Button>
          <ApplyLink
            bg="black"
            href="/apply"
            {...applyProps}
            bg={cieOrange}
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
  );
};

const CallTag = styled.p`
  font-family: Roboto;
  ${boxy}
  ${typography}
  color: white;
  /* text-shadow: 0.8px 0.5px 0.5px black, 0 0 1em black; */
`;

const HeroBg = styled.div`
  width: 100vw;
  height: auto;

  max-width: 100%;
  background-size: cover;
  ${background}
  ${boxy}
`;

const MainCtaButtons = styled.div`
  ${boxy}
  position: fixed;
  bottom: 0;
  background-color: ${darkGray};
`;

const applyProps = {
  fontSize: [1, 2],
  minWidth: "200px",
  m: 2,
  p: 2,
  py: 2,
};

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
      {isMobileSize && <MobileMain>mobileSize</MobileMain>}
      {!isMobileSize && (
        <>
          {/* <MainCtaButtons display="flex" maxWidth="600px" width="100%">
            <Button
              border="yellow"
              data-cy="hero-curric-btn"
              onClick={() => {
                setCurricModal(true);
                ReactGA.event({
                  category: "landingPage",
                  action: "openCurriculumModal",
                  label: "heroCtaCurricBtn",
                });
              }}
              {...applyProps}
              bg="black"
              color="yellow"
            >
              {landingPageContent.heroCta1}
            </Button>
            <ApplyLink
              onClick={() =>
                ReactGA.event({
                  category: "landingPage",
                  action: "goToRegisterPage",
                  label: "heroCtaRegisterBtn",
                })
              }
              href="/apply"
              data-cy="hero-reg-btn"
              {...applyProps}
              backgroundColor="yellow"
              color="black"
            >
              {landingPageContent.heroCta2}
            </ApplyLink>
          </MainCtaButtons> */}
          <HeroBg

            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundImage={[
              'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/home/liberty-tower-400px.webp")',
              null,
              'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-1280px.webp")',
            ]}
          >
            <HeroContent
              display="flex"
              flexDirection="column"
              textAlign="center"
              headerHeight={store.headerHeight}
            >
              <TitleH1
                textAlign="center"
                fontSize={[5, 6, 7]}
                color="#ffff"
                my={0}
                mt="4"
              >
                {content.title}
              </TitleH1>
              <CallTag mt="5" color="white" fontSize={[3, 4, 4, 5, 5]}>
                {content.subtitle}
              </CallTag>
              <Box mt="5" mb="4">
                <BiChevronDownCircle size={45} color="white" />
              </Box>
            </HeroContent>
          </HeroBg>

          {content.Section.map((section, idx) => (
            <Section
              key={idx}
              idx={idx}
              {...section}
              settings={settings}
              setCurricModal={setCurricModal}
            />
          ))}
          <ContentSection
            mt={[1, 4, 4, 4]}
            mb={4}
            pt="3"
            p="4"
            px="4"
            bg={lightCieOrangeBg}
          >
            <H2 {...h2Styles}>Get Notified</H2>
            <P mb="4" color="#370E00">
              No pierdas la oportunidad de cambiar tu vida, tu ingreso, y tu
              creatividad.
            </P>
            <P mb="4" color="#370E00">
              {" "}
              Inscríbete para recibir notificaciones sobre clases de muestra,
              nuevas clases, y nuestro newsletter con consejos de aprendizaje
              sobre la programación e inglés, y para saber más de nosotros.
            </P>
            <EmailForm
              submitBtnText="¡Manténme informado!"
              containerStyles={{
                background: "transparent",
                width: "100%",
                maxWidth: "400px",
              }}
              successView={
                <HappyAlert>
                  <P textAlign="center">
                    Estarás notificado de nuevos acontecimientos en Coding in
                    English
                  </P>
                </HappyAlert>
              }
            />
          </ContentSection>
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
