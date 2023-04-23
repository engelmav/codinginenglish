import React from "react";
import styled from "@emotion/styled";
import { Layout } from "../components/Layout";

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1a1a;
  color: #ffffff;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  font-family: "Arial Black", sans-serif;
  background: linear-gradient(90deg, #ff0000, #ffcc00, #ff00ff);
  -webkit-background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Name = styled.p`
  font-size: 1.25rem;
  font-weight: 300;
  margin: 0;
  //   text-align: right;
  flex: 1;
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    text-align: center;
    margin-bottom: 1rem;
  }

  /* Added styles for non-mobile view */
  @media (min-width: 769px) {
    flex: 1;
    text-align: right;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  font-family: "Arial Black", sans-serif;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff0000, #ffcc00, #ff00ff);
  -webkit-background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  @media (min-width: 769px) {
    width: 250px;
    margin-right: 2rem;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Line = styled.div`
  position: absolute;
  width: 1px;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
`;

export default function About() {
  return (
    <Layout>
      <Container>
        <Title>About Coding in English</Title>
        <p>
          Coding in English is a proud team of software developers and language
          instructors. We operate in the US, Central and South America, and
          Spain.
        </p>
        <Section>
          <Subtitle>Founder & Instructor</Subtitle>
          <Name>Vincent Engelmann</Name>
        </Section>
        <Section>
          <Subtitle>Editing, Marketing</Subtitle>
          <Name>Karen Morales-Engelmann</Name>
        </Section>
        <Section>
          <Subtitle>US Sales & Community Outreach</Subtitle>
          <Name>Harold Reyes</Name>
        </Section>
        <Section>
          <Subtitle>
            Curriculum Development & European Community Outreach
          </Subtitle>
          <Name>Laura Bohigas</Name>
        </Section>
        <Section>
          <Subtitle>CLIL Consultancy</Subtitle>
          <Name>Patrick de Boer</Name>
        </Section>
        <Section>
          <Subtitle>B2B Sales</Subtitle>
          <Name>Vincent Engelmann</Name>
        </Section>
      </Container>
    </Layout>
  );
}
