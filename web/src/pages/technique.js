import React from "react";
import { Technique } from "../Technique/Technique";
import Layout from "../components/Layout";
import {getStaticProps} from "../cmsLocaleStaticLoader";
export { getStaticProps };

const TechniquePage = (props) => (
  <Layout {...props}>
    <Technique />
  </Layout>
);

export default TechniquePage;
