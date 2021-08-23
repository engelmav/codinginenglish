import NextSteps from "../../CourseApplications/NextSteps";
import Layout from "../../components/Layout";
import React from "react";
import { getStaticProps } from "../../cmsLocaleStaticLoader";
import { authLazy } from "../../auth/AuthLazy";
import appStoreLazy from "../../stores/AppStoreLazy";
import { cieApi } from "../../services/cieApi";
export { getStaticProps };

const NextStepsView = (props) => (
  <Layout {...props}>
    <NextSteps
      authLazy={authLazy}
      appStoreLazy={appStoreLazy}
      cieApi={cieApi}
    />
  </Layout>
);

export default NextStepsView;
