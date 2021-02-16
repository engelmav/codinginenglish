import React from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { font } from "./UtilComponents/sharedStyles";
import { Link } from "react-router-dom";
import { Title, Main } from "./UtilComponents";
import Loader from "react-spinners/PulseLoader";
import { BeatLoader } from "react-spinners";

const ContentWrapper = styled.div`
  ${font}
  margin: 0 auto;
  max-width: 980px;
  min-width: 769px;
`;

function loadOrContent(condition, Loader, Content) {
  if (condition) {
    return Content;
  }
  return Loader;
}

const MyDashboard = observer((props) => {
  const { appStore } = props;

  const isLoaded = appStore.registeredSessions.length > 0;

  const RegisteredSessions = loadOrContent(
    isLoaded,
    <div>loading...</div>,
    <>
      <p>Currently registered classes:</p>
      <ul>
        {appStore.registeredSessions.map((sess, idx) => (
          <li key={idx}>{`${sess.module_name} ${sess.start_date}`}</li>
        ))}
      </ul>
    </>
  );

  return (
    <Main>
      <Title textAlign="center">{`${appStore.firstName}'s Dashboard`}</Title>
      <ContentWrapper
        style={{ margin: "0 auto", maxWidth: "980px", minWidth: "769px" }}
      >
        {appStore.authData && <h4>Welcome, {appStore.firstName}!</h4>}
        {appStore.sessionInProgress && (
          <p>Your class is in session. Go there now!</p>
        )}
        {RegisteredSessions}
        <p>Your next classes</p>
        <p>
          <Link to="/upcoming-sessions">Find more classes</Link>
        </p>
        <p>My Linux Box</p>
      </ContentWrapper>
    </Main>
  );
});

export { MyDashboard };
