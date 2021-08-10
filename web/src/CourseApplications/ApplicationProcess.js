import React from "react";
import {  Main } from "../UtilComponents";
import styled from "styled-components";
import { space } from "styled-system";

const AppContainer = styled(Main)`
  display: flex;
  flex-direction: column;
  ${space}
`;
const ApplicationProcess = ({ children }) => {
  return (
    <AppContainer mt={3} mb={3}>
     {children}
    </AppContainer>
  );
};

export default ApplicationProcess;
