import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { font, cieOrange } from "../UtilComponents/sharedStyles";
import { Link } from "react-router-dom";
import { Main } from "../UtilComponents";
import { Button } from "../UtilComponents/Button";
import { P, Title, TitleH2 } from "../UtilComponents/Typography/Typography"
import { Box } from "../UtilComponents/Box";
import Dialog from "@material-ui/core/Dialog";
import {
  flexDirection,
  alignItems,
  justifyContent,
  space,
} from "styled-system";

const ContentWrapper = styled.div`
  ${font}
  margin: 0 auto;
  max-width: 980px;
  min-width: 769px;
`;

const Flex = styled(Box)(
  {
    display: "flex",
  },
  flexDirection,
  alignItems,
  justifyContent
);

const inputBackground = `background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="black" stroke-width="2"><circle cx="7" cy="7" r="6" /><path d="M11 11 L15 15" /></svg>')`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  background-image: ${inputBackground};
  background-size: 0.7em;
  background-repeat: no-repeat;
  background-position: right 0.5em center;
  padding: 1rem;
  border-radius: 0.75rem;
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px ${cieOrange};
  }
  ${space}
`;

const QuestionText = styled(P)`
  font-family: "New Tegomin", serif;
`;

const MyDashboard = observer((props) => {
  const { appStore, cieApi } = props;
  const [registrations, setRegistrations] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [draftFirstname, setDraftFirstname] = useState("");
  const [draftLastname, setDraftLastname] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetDraftFirstname = (e) => {
    setDraftFirstname(e.target.value);
  };
  const handleSetDraftLastname = (e) => {
    setDraftLastname(e.target.value);
  };

  const handleSaveDraftNames = () => {
    appStore.firstName = draftFirstname;
    appStore.lastName = draftLastname;
    cieApi.updateUser(appStore.userId, {
      firstname: draftFirstname,
      lastname: draftLastname,
    });
    setOpen(false);
  };

  useEffect(() => {
    async function loadRegisteredSessions() {
      const reg = await cieApi.getUpcomingRegistrationsByUserId(
        appStore.userId
      );
      setRegistrations(reg);
    }
    loadRegisteredSessions();
  }, []);

  useEffect(() => {
    if (appStore.firstName === null) setOpen(true);
  }, window.location.pathname === "/my-dashboard" && appStore.firstName === null);

  const getClasses = (registrations) => {
    if (registrations === null) {
      return <p>Loading...</p>;
    }
    if (registrations.length === 0) {
      return <P>You're not registered for any classes. Sign up!</P>;
    } else {
      return (
        <>
          <P>Currently registered classes:</P>
          <ul>
            {registrations.map((sess, idx) => (
              <li key={idx}>{`${sess.module_name} ${sess.start_date}`}</li>
            ))}
          </ul>
          <a href="https://remote.codinginenglish.com/guacamole">
            My Linux Box
          </a>
        </>
      );
    }
  };

  return (
    <>
      <Main>
        <Title textAlign="center">{`${
          appStore.firstName ? appStore.firstName : "Student"
        }'s Dashboard`}</Title>

          {appStore.authData && <TitleH2>Welcome, {appStore.firstName}!</TitleH2>}
          {appStore.sessionInProgress && (
            <P>Your class is in session. Go there now!</P>
          )}
          {getClasses(registrations)}
          <P>
            <Link to="/upcoming-sessions">Find more classes</Link>
          </P>

      </Main>
      <Dialog
        onClose={handleClose}
        aria-labelledby="user-info-dialog"
        open={open}
      >
        <Box p={20} maxWidth="500px">
          <Title textAlign="center">Welcome to your Student Dashboard!</Title>
          <Flex flexDirection="column" justifyContent="center">
            <QuestionText>What's your name?</QuestionText>
            <Flex mb={10} flexDirection="column">
              <Box flexGrow="1" mb={10}>
                <Input
                  type="text"
                  value={draftFirstname}
                  placeholder="First Name"
                  onChange={handleSetDraftFirstname}
                />
              </Box>
              <Box flexGrow="1">
                <Input
                  type="text"
                  value={draftLastname}
                  placeholder="Last Name"
                  onChange={handleSetDraftLastname}
                />
              </Box>
            </Flex>
          </Flex>
          <Flex justifyContent="flex-end">
            <Button onClick={handleSaveDraftNames}>Save Changes</Button>
          </Flex>
        </Box>
      </Dialog>
    </>
  );
});

export { MyDashboard };
