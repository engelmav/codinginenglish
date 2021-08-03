import React from "react";
import settings from "../settings";
import { LandingPage } from "../rootProd";
import Layout from "../components/Layout";

const Index = () => (
  <Layout>
    <LandingPage settings={settings} />
  </Layout>
);

export default Index;
