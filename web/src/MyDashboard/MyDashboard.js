import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import { font } from "../UtilComponents/sharedStyles";
import { Link } from "react-router-dom";
import { Title, Main } from "../UtilComponents";
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
  const { appStore, cieApi } = props;
  const [registrations, setRegistrations] = useState(null);

  useEffect(() => {
    async function loadRegisteredSessions() {
      const reg = await cieApi.getUpcomingRegistrationsByUserId(appStore.userId);
      console.log("reg", reg)
      setRegistrations(reg);
    }
    loadRegisteredSessions();
  }, []);

  const getClasses = (registrations) => {
    if (registrations === null){
      return <p>Loading...</p>;
    }
    if (registrations.length === 0){
      return <p>You're not registered for any classes. Sign up!</p>
    } else {
      return <>
      <p>Currently registered classes:</p>
      <ul>
      {registrations.map((sess, idx) => (
        <li key={idx}>{`${sess.module_name} ${sess.start_date}`}</li>
      ))}
    </ul>
    <p>My Linux Box</p>
    </>;
    }
  }

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
        {getClasses(registrations)}
        <p>
          <Link to="/upcoming-sessions">Find more classes</Link>
        </p>
      </ContentWrapper>
    </Main>
  );
});

export { MyDashboard };
