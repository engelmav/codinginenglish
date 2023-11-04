import React from "react";
import { Technique } from "../Technique/Technique";
import Layout from "../components/Layout";
import { getStaticProps } from "../cmsLocaleStaticLoader";
import { AppStoreProvider } from "../stores/appStoreReact";
export { getStaticProps };

const TechniquePage = (props) => (
  <AppStoreProvider>
    <Layout {...props}>
      <Technique />
    </Layout>
  </AppStoreProvider>
);

export default TechniquePage;
