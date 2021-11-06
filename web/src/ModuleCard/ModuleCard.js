import { boxy, ContentSection } from "../UtilComponents";
import { P, H2, Ul, Li, TitleH1 } from "../UtilComponents/Typography/Typography";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { MdArticle } from "../components/markdown";
import styled from "styled-components";
import { background } from "styled-system";
import remarkGfm from "remark-gfm";
import { darkGray } from "../UtilComponents/sharedStyles";
import { useIntersection } from "../lib/useIntersectionObserver";

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

const ModuleCard = (props) => {
  const [registrationComponent, setRegistrationComponent] = useState(false);
  const {
    title: courseTitle,
    description,
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
      <SectionBg
        width="100%"
        background="linear-gradient(to bottom, #7927b2, #fb3182)"
      >
        <MdArticle borderColor="white" fontColor="white" headerColor="white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={description}
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
                  textAlign="left"
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
              li: ({ node, ...props }) => (
                <Li
                  {...props}
                />
              ),
            }}
          />
        </MdArticle>
      </SectionBg>
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
    </>
  );
};

export default ModuleCard;
