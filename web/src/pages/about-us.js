import React from "react";
import AboutUs from "../AboutUs";
import Layout from "../components/Layout";
import {getStaticProps} from "../cmsLocaleStaticLoader";
export { getStaticProps };

const AboutUsPage = (props) => (
  <Layout {...props}>
    <AboutUs />
  </Layout>
);

export default AboutUsPage;
