import React from 'react';
import {
  Main,
  Title,
  ContentSection
} from '../UtilComponents';
import styled from 'styled-components';

import { lightGray } from '../UtilComponents/sharedStyles'


const ContentSectionLanding = styled(ContentSection)`
`;


const BlockQuote = styled.blockquote`
  ${lightGray}
  font-family: serif;
  font-style: oblique;
  font-size: 1.5em;

  background: #f9f9f9;
  border-left: 10px solid #ccc;
  margin: 1.5em 10px;
  padding: 0.5em 10px;

  &:before {
    color: #ccc;
    content: open-quote;
    font-size: 2em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }
`;

const I = styled.p`
  font-style: italic;
`;

const Home = (props) => {
  return (
    <Main>
      <Title textAlign="center" fontSize='4em'>Coding in English</Title>
      <ContentSection>
        <BlockQuote>
        "As a foreign student, learning any subject ... was extremely tough. In order to learn, I needed to understand a basic tool first: English."
        </BlockQuote>
        <Title textAlign="center" margin="35px">
          Jump into the global mainstream. Learn English while you learn to code.
        </Title>
        <hr style={{margin: '10px 0'}} />
      </ContentSection>
      <Title>Conversation Skills at the Office</Title>
      <ContentSection>
        <p>We build topic-based classes. You practice conversation in every class, specifically on software engineering.</p>
        <I>And build real software in the process.</I>
        </ContentSection>
      <Title>Build a Technical Portfolio</Title>
      <ContentSection>Build your portfolio as you go, with free, industry-standard tools to prove your knowledge.</ContentSection>
      <Title>Learn Vocabulary and Grammar in a Real Context</Title>
      <ContentSection>Jump into the global mainstream. Learn English while you code.</ContentSection>
    </Main>
  );
}


export { Home };