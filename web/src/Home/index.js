import React, { useEffect, useState } from "react";
import { Main, ContentSection, Button } from "../UtilComponents";
import { Title, P } from "../UtilComponents/Typography/Typography";
import { whenSmallScreen, fontMonospace } from "../UtilComponents/sharedStyles";
import BlockQuote from "../UtilComponents/BlockQuote";
import { Box } from "../UtilComponents/Box";
import {
  orangeBgColor,
  darkGray,
  debugBorder,
  cieOrange,
} from "../UtilComponents/sharedStyles";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import { CloseBox } from "../UtilComponents/CloseBox/CloseBox";

const SectionImage = styled.img`
  width: 225px;
  padding-bottom: 20px;
  ${whenSmallScreen`
    width: 70px;
    height: auto;`}
`;

const LPButton = styled(Button)`
  padding: 10px;
  color: white;
  ${fontMonospace}
`;

const MainLanding = styled(Main)`
  width: min(90%, 700px);
  & .cie-title {
    font-family: monospace;
    font-size: max(1rem, min(2.5rem, 3vw));
  }
  display: flex;
  flex-direction: column;
  ${debugBorder}
  & .section {
    flex-basis: 100%;
  }
`;

const ContentSectionLanding = styled(ContentSection)`
  line-height: 1.5em;
`;

const I = styled.p`
  font-style: italic;
`;

const RegisterLink = styled(Link)`
  ${orangeBgColor}
  text-decoration: none;
  display: inline-block;
  text-align: center;
  padding: 10px;
  color: white;
  ${fontMonospace}
  a {
    color: ${cieOrange};
  }
`;

const TaglineTitle = styled.h1`
  font-family: Andale Mono, AndaleMono, monospace;
  color: ${darkGray};
  /* font-size: max(1rem, min(2.5rem, 2.5vw)); */
  ${whenSmallScreen`
    font-size: 1.25rem;`}
  font-weight: bolder;
  text-align: center;
  padding: 0;
  margin: 0;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  color: ${darkGray};
  ${debugBorder}
`;

const TechStackImg = styled.img`
  width: 100%;
  height: auto;
  padding-bottom: 20px;
`;

const Home = (props) => {
  const { settings } = props;
  const [isOpenLiveTeaching, setIsOpenLiveTeaching] = useState(false);
  return (
    <MainLanding p={20}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={20}>
        <Box mt={4}>
          <TaglineTitle>Jump into the global mainstream.</TaglineTitle>
        </Box>
        <Box mt={40}>
          <RegisterLink to="/upcoming-classes">
            Learn English as you learn to code.
          </RegisterLink>
        </Box>
      </Box>
      <Box mt={40} alignSelf="center">
        <SectionImage
          alt="Speak English, Build Apps"
          src={`${settings.assets}/home/chat-icon-green-red.png`}
        />
      </Box>
      <SectionTitle>Speak English, Build Apps</SectionTitle>
      <ContentSectionLanding>
        <p>
          Practice conversation in every class, specifically on software
          engineering.
        </p>
        <p>
          Topics range from working with product managers, co-workers, clients,
          performing code reviews, asking questions on forums, reading
          documentation, and many more.
        </p>
        <I>And build real software in the process.</I>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <TechStackImg
          alt={"Software Stack"}
          src={`${props.settings.assets}/home/3-tech.png`}
        />
      </Box>
      <SectionTitle>Create Your Technical Portfolio</SectionTitle>
      <ContentSectionLanding>
        <p>Build your portfolio as you go.</p>
        <p>
          All your work in classes is yours, for display in your portfolio
          WebApp. Show-off to potential employers your skills in ReactJS,
          Python, and MySQL, with professional code in a GitHub repository, and
          a real, deployed WebApp.
        </p>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <SectionImage
          alt="Learn Vocabulary and Grammar in Real Context"
          src={`${settings.assets}/home/dictionary.png`}
        />
      </Box>
      <SectionTitle>Learn Vocabulary and Grammar in Real Context</SectionTitle>
      <ContentSectionLanding>
        <p>
          We supplement all courses with grammar and vocabulary practices,
          tightly integrated into technical lessons.
        </p>
      </ContentSectionLanding>
      <Box mt={40} alignSelf="center">
        <SectionImage
          alt="Learn in a Live Teaching Environment"
          src={`${settings.assets}/home/meeting.png`}
        />
      </Box>
      <SectionTitle>Learn in a Live Teaching Environment</SectionTitle>
      <ContentSectionLanding>
        <p>
          With so many classes moving to massive open online courses, students
          are left to learn in isolation. We bring back the warmth, motivation,
          and community that online classes are currently lacking. Do pair work
          activities in class, ask your instructor questions, laugh, and share
          your doubts and your accomplishments!
        </p>
        <LPButton
          alignSelf="center"
          onClick={() => setIsOpenLiveTeaching(true)}
        >
          Learn more
        </LPButton>
        <Dialog
          open={isOpenLiveTeaching}
          onBackdropClick={() => setIsOpenLiveTeaching(false)}
        >
          <ContentSectionLanding p={10}>
            <CloseBox
              size="30"
              alignSelf="flex-end"
              onClick={() => setIsOpenLiveTeaching(false)}
            />
            <Title>Live Teaching</Title>
            <P>
              Students work with instructors as a group and one-on-one. The
              virtual classroom is equipped with embedded video and chat, with
              interactive English and programming exercises. The programming
              exercises are even performed in a fully-equipped Ubuntu virtual
              machine, right in the virtual classroom!{" "}
            </P>
            <P>
              Get live help from your instructor when you're stuck or don't
              understand a lesson. No more dry discussion boards (although we'll
              have those too.) Shout out when you're lost! Get help from a
              patient and knowledgeable instructor. You're not in this alone!
            </P>
            <LPButton
              alignSelf="center"
              onClick={() => setIsOpenLiveTeaching(false)}
            >
              Done!
            </LPButton>
          </ContentSectionLanding>
        </Dialog>
        <BlockQuote cite="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
          <p>
            "As a foreign student, learning any subject ... was extremely tough.
            In order to learn, I needed to understand a basic tool first:
            English."
          </p>
          <footer>
            —Takeishi Kimoto,{" "}
            <cite>
              <a href="https://medium.com/@lnuk2009jp/is-english-language-really-that-important-in-learning-programming-812a78be79b5">
                Is English Language Really That Important in Learning
                Programming?
              </a>
            </cite>
          </footer>
        </BlockQuote>
      </ContentSectionLanding>
    </MainLanding>
  );
};

export { Home };
