import React from "react";
import AboutUs from "../AboutUs";
import Layout from "../components/Layout";
import { getStaticProps } from "../cmsLocaleStaticLoader";
import { AppStoreProvider } from "../stores/appStoreReact";
export { getStaticProps };

const AboutUsPage = (props) => (
  <AppStoreProvider>
    <Layout {...props}>
      <AboutUs />
    </Layout>
  </AppStoreProvider>
);

export default AboutUsPage;
