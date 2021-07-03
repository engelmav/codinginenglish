import { Link, Route, Switch } from "react-router-dom";
import { Timeline } from "./Timeline";
import React, { useEffect, useState } from "react";
import { TextInput, Button, Main, Title } from "../UtilComponents";
import { P, Ol, TitleH2 } from "../UtilComponents/Typography/Typography";
import { Box } from "../UtilComponents/Box";
import styled from "styled-components";
import { space } from "styled-system";


const AppContainer = styled(Main)`
  display: flex;
  flex-direction: column;
  ${space}
`;
export const ApplicationProcess = ({ Register }) => {
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
          {/* <Route
          exact
          path="/apply/application"
          component={() => <BasicCourseForm setMilestone={setMilestone} />}
        ></Route> */}
        </Switch>
    </AppContainer>
  );
};
