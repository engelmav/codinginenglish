import React, { useRef, useState } from "react";
import {
  ApplyLink,
  AutoScaleImage,
  Box,
  boxy,
  ContentSection,
} from "../UtilComponents";
import { H2, P, TitleH1, Ul } from "../UtilComponents/Typography/Typography";
import { Strong, Title } from "../components/typography"
import BlockQuote from "../UtilComponents/BlockQuote";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import {
  cieOrange,
  lightCieOrangeBg,
  darkGray,
} from "../UtilComponents/sharedStyles";
import { background } from "styled-system";
import dynamic from "next/dynamic";
import { useAppStore } from "../stores/appStoreReact";
import { useIntersection } from "../lib/useIntersectionObserver";

const MailingList = dynamic(() => import("../components/MailingList"));
const FreshPosts = dynamic(() => import("../components/FreshPosts"));

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const AboveFold = styled.div`
  min-height: calc(100vh - ${({ headerHeight }) => headerHeight}px);
  display: flex;
  flex-direction: column;
  ${boxy}
  width: 100%; // prevents overflow from 100vw higher up
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
  p: 4,
  pt: 5,
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
            <ApplyLink
              mt={[3, 4, 4, 5]}
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
        )}
      </ContentSection>
    </SectionBg>
  );
};


const LandingPage = (props) => {
  const { settings, landingPageContent, mailingListComponentContent, locale } = props;
  const content = landingPageContent;
  const store = useAppStore();

  const [postsInView, setPostsInView] = useState(false);
  const [mailingListInView, setMailingListInView] = useState(false);
  const freshPostsRef = useRef();
  const mailingListRef = useRef();
  useIntersection(freshPostsRef, () => setPostsInView(true));
  useIntersection(mailingListRef, () => setMailingListInView(true));

  return (
    <>
      <AboveFold headerHeight={store.headerHeight}>
        <Box
          p="4"
          display="flex"
          width="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"

        >
          <ReactMarkdown
              children={content.title}
              components={{
                p: ({ node, ...props }) => (
                  <TitleH1 color="black" {...props}/>
                ),
                strong: ({ node, ...props }) => <Strong {...props} />,
              }}
            />
        </Box>
        <Box
          
          display="flex"
          flexDirection="column"
          alignItems="center"
          
          p="4"
          pt="0"
        >
          <Box
            display="flex"
            flexDirection="column"
            flex="1"
            justifyContent="center"
            pb="4"
          >
            <ReactMarkdown
              children={`${content.subsubtitle} ${content.subtitle}`}
              components={{
                p: ({ node, ...props }) => (
                  <P
                    color="black"
                    textAlign="left"
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
            
            justifyContent="center"
            maxWidth="500px"
            width="100%"
          >

            <ApplyLink
              
              minWidth="250px"
              p="3"
              href="/courses"
              color="white"
              border="none"
              bg={cieOrange}
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
      <div style={{ width: "100%" }}>
        {content.Section.map((section, idx) => (
          <Section key={idx} idx={idx} {...section} settings={settings} />
        ))}
      </div>
      <Box mt="4" maxWidth="400px">
        <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
          <P>{content.quote[0].quoteText}</P>
          <footer>
            —Takeishi Kimoto,{" "}
            <cite>
              <a href={content.quote[0].sourceLink}>
                {content.quote[0].sourceLinkText}
              </a>
            </cite>
          </footer>
        </BlockQuote>
      </Box>
      <SectionBg ref={freshPostsRef}>{postsInView && <FreshPosts locale={locale} title={content.postsTitle} />}</SectionBg>
      <SectionBg ref={mailingListRef}>
        <ContentSection mb="5" px="4" maxWidth="550px">
          {mailingListInView && (
            <MailingList
              headerStyles={h2Styles}
              content={mailingListComponentContent}
            />
          )}
        </ContentSection>
      </SectionBg>
    </>
  );
};

export default LandingPage;
