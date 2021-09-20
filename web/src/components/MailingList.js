import React from "react";
import { H2, P, textStyles } from "../UtilComponents/Typography/Typography";
import EmailForm from "./EmailForm";
import { HappyAlert } from "./Alerts";
import { cieApi } from "../services/cieApi";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Box } from "../UtilComponents";
import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const Ul = styled.ul`
  ${textStyles}
  margin-left: 1em;

  li {
    list-style-type: "🦾";
    padding: 0.6em 0 0 0.2em;
    position: relative;
    margin-left: 20px;
  }
  li::marker {
    font-size: 2em; /* or whatever */
  }
`;

const RobotListItem = ({ children }) => (
  <Box display="flex" alignItems="center" justifyContent="" mb="3">
    <Box>
      <P fontSize="5">🦾</P>
    </Box>
    <Box ml="3" flex="1">
      {children}
    </Box>
  </Box>
);

const makeP = ({ node, ...props }) => (
  <P fontSize={[2, 2, 2, 3, 3]} pb="0" mb="4" {...props} />
);
const makeH2 = ({ node, ...props }) => (
  <H2 background="yellow" mb="2" textAlign="left" {...props} />
);
const makeUl = ({ node, ...props }) => (
  <Ul background="yellow" mb="2" textAlign="left" {...props} />
);
const makeLi = ({ node, ...props }) => <RobotListItem {...props} />;

const MailingList = ({ headerStyles, content }) => {
  return (
    <>
      <H2 {...headerStyles}>Manténte al tanto</H2>
      <ReactMarkdown
        components={{
          p: makeP,
          h2: makeH2,
          ul: makeUl,
          li: makeLi,
        }}
      >
        {content.blurb}
      </ReactMarkdown>
      <EmailForm
        submitBtnText="¡Manténme informado!"
        containerStyles={{
          background: "transparent",
          width: "100%",
          maxWidth: "400px",
        }}
        gaCategory="mailingList"
        onCaptureEmail={(email) => {
          cieApi.createUserEmail({ email, status: "curriculumDownload" });
          ReactGA.event({
            category: "mailingList",
            action: "clickedSubscribeMailingList",
            label: "mailinglist email capture",
          });
        }}
        successView={
          <HappyAlert p="4">
            <P mb="0" textAlign="center">
              Great! Te hemos enviado el currículo a tu correo. Estarás
              notificado de nuevos acontecimientos en Coding in English.
            </P>
          </HappyAlert>
        }
      />
    </>
  );
};

export { MailingList };
export default MailingList;
