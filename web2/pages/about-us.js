import React from "react";
import { H1, H2 as H2Base, P } from "../components/typography";
import tw, { styled } from "twin.macro";

const H2 = styled(H2Base)`

  font-weight: 900;

`

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Name = styled(P)`
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0;

  flex: 1;
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: 1rem;
  }

  @media (min-width: 769px) {
    flex: 1;
    text-align: right;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  background-color: transparent;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Blurb = styled(P)`
  font-size: 1.25rem;
`;

export default function About() {
  return (
    <Container>
      <H1 tw="text-center">About Coding in English</H1>
      <Blurb tw="my-6">
        Coding in English is a proud team of software developers and language
        instructors. We operate in the US, Central and South America, and Spain.
      </Blurb>
      <Section>
        <H2>Founder & Instructor</H2>
        <Name>Vincent Engelmann</Name>
      </Section>
      <Section>
        <H2>Editing, Marketing</H2>
        <Name>Karen Morales-Engelmann</Name>
      </Section>
      <Section>
        <H2>US Sales & Community Outreach</H2>
        <Name>Harold Reyes</Name>
      </Section>
      <Section>
        <H2>Curriculum Development & European Community Outreach</H2>
        <Name>Laura Bohigas</Name>
      </Section>
      <Section>
        <H2>CLIL Consultancy</H2>
        <Name>Patrick de Boer</Name>
      </Section>
      <Section>
        <H2>B2B Sales</H2>
        <Name>Vincent Engelmann</Name>
      </Section>
    </Container>
  );
}
