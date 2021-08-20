import React from "react";
import settings from "../settings";
import LandingPage from "../LandingPage/LandingPage";
import Layout from "../components/Layout";


const Index = (props) => (
  <Layout>
    <LandingPage {...props} settings={settings} />
  </Layout>
);

export async function getStaticProps({ locale }) {
  console.log("Retrieving content for locale", locale)
  const localeContentUrl = `https://content.codinginenglish.com/landing-page?_locale=${locale}`;
  const res = await fetch(localeContentUrl);
  const content = await res.json();
  return {
    props: {
      content,
    },
  };
}

export default Index;
