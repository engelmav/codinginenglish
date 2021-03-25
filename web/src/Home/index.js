import React from "react";
import { Main, Title, ContentSection } from "../UtilComponents";
import {
  lightGray,
  orangeBgColor,
  darkGray,
  debugBorder,
  cieOrange,
} from "../UtilComponents/sharedStyles";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { space, color, layout } from "styled-system";

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
  padding-bottom: 20px;
  line-height: 1.5em;
  margin-bottom: 1.5rem;
`;

const BlockQuote = styled.blockquote`
  ${lightGray}
  font-family: serif;
  font-size: 1.5rem;

  p {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    margin-bottom: 0;
    font-size: clamp(1rem, 1.25vw, 1.25rem);
  }

  p:before {
    color: #ccc;
    content: open-quote;
    font-size: 2em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }

  footer {
    font-size: 0.7em;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    margin-top: 0;
  }

  a {
    text-decoration: none;
  }
`;

const I = styled.p`
  font-style: italic;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const RegisterLink = styled(Link)`
  ${orangeBgColor}
  text-decoration: none;
  display: inline-block;
  text-align: center;
  padding: 10px;
  color: white;
  a {
    color: #3d3636;
  }
`;

const RegisterButton = () => (
  <div style={{ textAlign: "center" }}>
    <RegisterLink to="/classes">Go to classes</RegisterLink>
  </div>
);

const TaglineTitle = styled.h1`
  // background-color: ${darkGray}
  // color: white;
  font-family: sans-serif;
  color: ${darkGray};
  text-transform: uppercase;
  font-size: max(1rem, min(2.5rem, 2.5vw));
  font-weight: bolder;
  text-align: center;
  padding:0;
  margin:0;
`;

const TaglineSubtitle = styled.h2`
  padding: 0;
  margin: 0;
  font-family: sans-serif;
  text-transform: uppercase;
  text-align: center;
  font-size: max(0.75rem, min(1.5rem, 1.5vw));
`;

const SectionTitle = styled(Title)`
  // font-size: 3vw;              // ok on desktop, too small on mobile
  // font-size: 2.5rem;           // too big on mobile.
  // font-size: min(2.5rem, 3vw); // ok on desktop, too small on mobile
  // font-size: max(2.5rem, 3vw); // ok on desktop, too big on mobile
  // font-size: 1.75rem; // ok on mobile, too small on desktop
  font-size: max(1.75rem, min(2.5rem, 3vw));
  font-family: sans-serif;
  text-align: center;
  color: ${darkGray};
  ${debugBorder}
`;

const Box = styled.div(
  {
    boxSizing: "border-box",
    minWidth: 0,
  },
  space,
  color,
  layout
);

const Home = (props) => {
  return (
    <MainLanding>
      <Box mb={20}>
        <Box mb={10}>
          <TaglineTitle>Jump into the global mainstream.</TaglineTitle>
        </Box>
        <TaglineSubtitle>Learn English as you learn to code.</TaglineSubtitle>
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
        <RegisterButton />
      </ContentSectionLanding>
      <SectionTitle>Create Your Technical Portfolio</SectionTitle>
      <ContentSectionLanding>
        <p>Build your portfolio as you go.</p>
        <p>
          All your work in classes is yours, for display in your portfolio
          WebApp. Show-off to potential employers your skills in ReactJS,
          Python, and MySQL, with professional code in a GitHub repository, and
          a real, deployed WebApp.
        </p>
        <Box p={20}>
          <ImgContainer>
            {[
              "react-logo-150.png",
              "python-logo-150.png",
              "mysql-logo-150.png",
            ].map((src, idx) => (
              <img
                alt={src}
                key={idx}
                style={{ height: "150px" }}
                src={`${props.settings.assets}/${src}`}
              />
            ))}
          </ImgContainer>
        </Box>
        <RegisterButton />
      </ContentSectionLanding>
      <SectionTitle>Learn Vocabulary and Grammar in Real Context</SectionTitle>
      <ContentSectionLanding>
        <p>
          We supplement all courses with grammar and vocabulary practices,
          tightly integrated into technical lessons.
        </p>
        <RegisterButton />
      </ContentSectionLanding>
      <SectionTitle>Learn in a Live Teaching Environment</SectionTitle>
      <ContentSectionLanding>
        <p>
          With so many classes moving to massive open online courses, students
          are left to learn in isolation. We bring back the warmth, motivation,
          and community that online classes are currently lacking. Do pair work
          activities in class, ask your instructor questions, laugh, and share
          your doubts and your accomplishments!
        </p>
        <RegisterButton />
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
