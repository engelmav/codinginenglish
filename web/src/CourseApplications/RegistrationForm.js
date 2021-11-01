import React from "react";
import { boxy } from "../UtilComponents/Box";
import styled from "styled-components";
import { BasicCourseForm } from "./BasicCourse";

import ReactGA from "react-ga";

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);

const Container = styled.div`
  ${boxy}
`;

/* for the love of god, remove this layer and lift BasicCourseForm directly into the courses page. */
const RegistrationForm = ({ cieApi, dividerStyles }) => {
  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
        textAlign="center"
        p="3"
      >
        <BasicCourseForm
          cieApi={cieApi}
          dividerStyles={dividerStyles}
          containerStyles={{
            bg: "transparent",
            width: "100%",
            maxWidth: "600px",
          }}
        />
      </Container>
    </>
  );
};

export default RegistrationForm;
