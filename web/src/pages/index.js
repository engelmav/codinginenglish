import React from "react";
import settings from "../settings";
import LandingPage from "../LandingPage/LandingPage";
import Layout from "../components/Layout";

const Index = () => (
  <Layout>
    <LandingPage settings={settings} />
  </Layout>
);

export default Index;
