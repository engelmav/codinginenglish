import { boxy, ContentSection } from "../UtilComponents";
import {
  P,
  H2,
  Ul,
  Li,
  TitleH1,
} from "../UtilComponents/Typography/Typography";
import { Th } from "../components/typography";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { MdArticle } from "../components/markdown";
import styled from "styled-components";
import { background } from "styled-system";
import remarkGfm from "remark-gfm";
import { darkGray } from "../UtilComponents/sharedStyles";
import { useIntersection } from "../lib/useIntersectionObserver";
import rehypeRaw from "rehype-raw";

const RegistrationForm = dynamic(() =>
  import("../CourseApplications/RegistrationForm")
);

const SectionBg = styled.div`
  ${boxy}
  ${background}
  display: flex;
  justify-content: center;
`;

const Hero = styled.div`
  ${boxy}
`;
const WithSvg = styled(MdArticle)`
  .svgwrapper {
    display: flex;
    justify-content: center;
    padding: 1em;
  }
  svg {
    color: white;
    height: 55px;
    width: 55px;
  }
  .numberedlist {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-gap: 1rem;
    align-items: center;
    .note {
      grid-column: 1 / span 2;
    }
    p {
      margin: 0;
      padding: 0;
    }
    .roundnumber {
      background-clip: text;
      background-color: white;
      border-radius: 18px;
      height: 36px;
      width: 36px;
      font-weight: 700;
      font-size: 15px;
      font-family: Lato;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        background-image: linear-gradient(to bottom, #7927b2, #fb3182);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
      }
    }
  }
`;

const Section = ({ content }) => {
  return (
    <SectionBg
      width="100%"
      background="linear-gradient(to bottom, #7927b2, #fb3182)"
    >
      <WithSvg borderColor="white" fontColor="white" headerColor="white">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          children={content}
          components={{
            p: ({ node, ...props }) => (
              <P
                color="white"
                fontSize={[2, 2, 2, 3, 3]}
                pb="0"
                mb="1"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <H2
                color="white"
                background="yellow"
                mb="2"
                textAlign="center"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <Ul
                markerColor="yellow"
                color="white"
                background="yellow"
                mb="2"
                textAlign="left"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <Li {...props} />,
            th: ({ node, ...props }) => <Th {...props} />,
          }}
        />
      </WithSvg>
    </SectionBg>
  );
};

const ModuleCard = (props) => {
  const [registrationComponent, setRegistrationComponent] = useState(false);
  const {
    title: courseTitle,
    description,
    paymentDetails,
    course_instances: courseInstances,
  } = props.moduleData;
  const registrationRef = useRef();
  useIntersection(registrationRef, () => setRegistrationComponent(true));
  return (
    <>
      <Hero p="3" width="100%">
        <TitleH1 color={darkGray} textAlign="center">
          Full Stack Development Essentials
        </TitleH1>
      </Hero>
      <Section content={description} />
      <SectionBg width="100%" ref={registrationRef}>
        {registrationComponent && (
          <ContentSection px="3" pt={[0, 5]} pb={[4, 5]}>
            <H2 color="black" mb="3" mt="4" textAlign="center">
              Solicita una plaza
            </H2>
            <P>
              La cantidad máxima de estudiantes es 8 por clase, porque se
              requiere mucha interacción con el instructor.
            </P>
            <RegistrationForm
              dividerStyles={{ color: "black", background: "black" }}
            />
          </ContentSection>
        )}
      </SectionBg>
      <Section content={paymentDetails} />
    </>
  );
};

export default ModuleCard;
