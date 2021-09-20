import { Box, boxy, Button, ContentSection } from "../UtilComponents";
import { P, H2, Ul, TitleH1 } from "../UtilComponents/Typography/Typography";
import React, { useState } from "react";
import Modal from "../components/Modal";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { background } from "styled-system";
import remarkGfm from "remark-gfm";
import useInView from "react-cool-inview";
import { darkGray } from "../UtilComponents/sharedStyles";

const RegistrationForm = dynamic(() =>
  import("../CourseApplications/RegistrationForm")
);

const MailingList = dynamic(() => import("../components/MailingList"));

const SectionBg = styled.div`
  ${boxy}
  ${background}
  display: flex;
  justify-content: center;
`;

const Hero = styled.div`
  ${boxy}
  background-color: ${darkGray};
`;

const ModuleCard = (props) => {
  const [registerModal, setRegisterModal] = useState(false);
  const {
    title: courseTitle,
    description,
    course_instances: courseInstances,
  } = props.moduleData;
  const { observe, inView } = useInView();
  const { mailingListComponentContent } = props;
  return (
    <>
      <Hero p="3" width="100%" >
        <TitleH1 color="white" textAlign="center">WebApp Development - Basic</TitleH1>
        <TitleH1 textAlign="center">💻</TitleH1>
      </Hero>
      <SectionBg
        width="100%"
        background="linear-gradient(to bottom, #7927b2, #fb3182)"
      >
        <ContentSection px="3" pt={[0, 5]} pb={[4, 5]}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            children={description}
            components={{
              p: ({ node, ...props }) => (
                <P
                  color="white"
                  fontSize={[2, 2, 2, 3, 3]}
                  pb="0"
                  mb="4"
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
                  color="white"
                  background="yellow"
                  mb="2"
                  textAlign="left"
                  {...props}
                />
              ),
            }}
          />
          <Button
            border="none"
            bg="yellow"
            color="black"
            alignSelf="center"
            maxWidth="500px"
            minWidth="200px"
            mt={3}
            p={2}
            fontSize={[1, 2, 4]}
            onClick={() => setRegisterModal(true)}
          >
            Inscríbeme
          </Button>
        </ContentSection>
      </SectionBg>

      <SectionBg ref={observe}>
        <ContentSection
          mt={[1, 4, 4, 4]}
          mb={4}
          pt="3"
          p="4"
          px="4"
          maxWidth="550px"
        >
          {inView && <MailingList content={mailingListComponentContent} />}
        </ContentSection>
      </SectionBg>
      {registerModal && (
        <Modal
          backgroundStyles={{ p: 20 }}
          modalStyles={{
            mt: 0,
            mx: 0,
            flex: 1,
            height: ["100vh", null, "80%"],
            width: ["60px"],
          }}
          containerStyles={{ overflowY: "scroll" }}
          title="Inscripción"
          onClose={() => setRegisterModal(false)}
        >
          <RegistrationForm />
        </Modal>
      )}
    </>
  );
};

export default ModuleCard;
