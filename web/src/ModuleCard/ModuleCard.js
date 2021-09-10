import { boxy, Button, ContentSection } from "../UtilComponents";
import { P, H2, Ul } from "../UtilComponents/Typography/Typography";
import { Flex, Image } from "rebass";
import React, { useEffect, useState } from "react";
import settings from "../settings";
import Modal from "../components/Modal";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { HeroBg } from "../components/HeroBg";
import styled from "styled-components";
import {flexbox, typography, layout} from "styled-system"

const RegistrationForm = dynamic(() =>
  import("../CourseApplications/RegistrationForm")
);

const HeroContainer = styled.div`
  display: flex;
  ${boxy}
  width: 100vw;
  max-width: 100%;
`;
const HeroContent = styled.div`
  ${boxy}
  display: flex;
  flex-direction: column;
  ${flexbox}
  ${typography}
  ${layout}
`;

const ModuleCard = (props) => {
  const [registerModal, setRegisterModal] = useState(false);
  const {
    title: courseTitle,
    description,
    course_instances: courseInstances,
  } = props.moduleData;
  return (
    <>
      <HeroContainer textAlign="center" justifyContent="center">
        <HeroBg
          display="flex"
          height="100%"
          backgroundImage={[
            'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/courses/together-400px-cropped.webp")',
            null,
            'url("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/nyc-sunrise-vertical-1280px.webp")',
          ]}
        >
          <HeroContent
            display="flex"
            textAlign="center"
            justifyContent="center"
            height={["auto", null, 400]}
          >
            <H2
              px="2"
              textAlign="center"
              fontSize={[4, 6, 7]}
              color="white"
              my="4"
              py={3}
              color="white"
              fontWeight="bold"
              textAlign="center"
            >
              {courseTitle}
            </H2>
          </HeroContent>
        </HeroBg>
      </HeroContainer>
      <ContentSection px="3">
        <ReactMarkdown
          children={description}
          components={{
            p: ({ node, ...props }) => (
              <P fontSize={[2, 2, 2, 3, 3]} pb="0" mb="4" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <H2 background="yellow" mb="2" textAlign="left" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <Ul background="yellow" mb="2" textAlign="left" {...props} />
            ),
          }}
        />
        {courseInstances.map((ms, idx) => {
          return (
            <Button
              border="none"
              color="white"
              alignSelf="center"
              maxWidth="500px"
              minWidth="200px"
              mt={3}
              p={2}
              key={idx}
              onClick={() => setRegisterModal(true)}
            >
              Inscríbeme
            </Button>
          );
        })}
      </ContentSection>
      {registerModal && (
        <Modal
          backgroundStyles={{ p: 20 }}
          modalStyles={{ mt: 0, mx: 0, flex: 1, height: "100%" }}
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
