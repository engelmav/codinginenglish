import Layout from "../../components/Layout";
import Register from "../../CourseApplications/Register"
import React from "react";
import { getStaticProps } from "../../cmsLocaleStaticLoader";
import { authLazy } from "../../auth/AuthLazy";
import appStoreLazy from "../../stores/AppStoreLazy";
export { getStaticProps };

// export const Register = compose(_Register, { Timeline, appStoreLazy, authLazy, cieApi });


const RegisterView = (props) => (
  <Layout {...props}>
    <Register authLazy={authLazy} appStoreLazy={appStoreLazy}/>
  </Layout>
);

export default RegisterView;
