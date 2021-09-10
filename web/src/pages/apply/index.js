import RegistrationForm from "../../CourseApplications/RegistrationForm";
import Layout from "../../components/Layout";
import React from "react";
import { getStaticProps } from "../../cmsLocaleStaticLoader";
import { authLazy } from "../../auth/AuthLazy";
import appStoreLazy from "../../stores/AppStoreLazy";
import { cieApi } from "../../services/cieApi";
import { AppStoreProvider } from "../../stores/appStoreReact";
export { getStaticProps };

const RegistrationView = (props) => (
  <AppStoreProvider>
    <Layout {...props}>
      <RegistrationForm
        authLazy={authLazy}
        appStoreLazy={appStoreLazy}
        cieApi={cieApi}
      />
    </Layout>
  </AppStoreProvider>
);





export default RegistrationView;
