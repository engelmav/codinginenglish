import {  Route, Switch } from "react-router-dom";
import { Timeline } from "./Timeline";
import React from "react";
import {  Main } from "../UtilComponents";
import styled from "styled-components";
import { space } from "styled-system";

const AppContainer = styled(Main)`
  display: flex;
  flex-direction: column;
  ${space}
`;
const ApplicationProcess = ({ Register, NextSteps }) => {
  const [milestone, setMilestone] = React.useState("");
  return (
    <AppContainer className="app-process-main" mt={3} mb={3}>
      <Timeline milestone={milestone} />
      <Switch>
        <Route
          exact
          path="/apply"
          component={() => <Register setMilestone={setMilestone} />}
        ></Route>
        <Route
          exact
          path="/apply/next-steps"
          component={() => <NextSteps setMilestone={setMilestone} />}
        ></Route>
      </Switch>
    </AppContainer>
  );
};

export default ApplicationProcess;
