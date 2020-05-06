import React from 'react';
import {
  Main,
  Title,
  ContentSection
} from '../UtilComponents';


const Home = (props) => {
  return (
    <Main>
      <Title>Coding in English</Title>
      <ContentSection>Jump into the global mainstream. Learn English while you code.</ContentSection>
      <Title>Conversation Skills at the Office</Title>
      <ContentSection>We build our classes to be topic-focused. You practice conversation in every class, on topics that are important for software engineering.</ContentSection>
      <Title>Build a Technical Portfolio</Title>
      <ContentSection>Build your portfolio as you go, with free, industry-standard tools to prove your knowledge.</ContentSection>
      <Title>Learn Vocabulary and Grammar in a Real Context</Title>
      <ContentSection>Jump into the global mainstream. Learn English while you code.</ContentSection>
    </Main>
  );
}


export { Home };