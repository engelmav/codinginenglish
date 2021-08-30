import React from "react";
import settings from "../settings";
import LandingPage from "../LandingPage/LandingPage";
import Layout from "../components/Layout";
import getContent from "../cms";
import { AppStoreProvider } from "../stores/appStoreReact";

const Index = (props) => (
  <AppStoreProvider>
    <Layout {...props}>
      <LandingPage {...props} settings={settings} />
    </Layout>
  </AppStoreProvider>
);

export async function getStaticProps(params) {
  let locale = params?.locale;
  if (locale === undefined || locale === null) {
    locale = "es";
  }
  const landingPageContent = await getContent(locale, "landing-page");
  const headerContent = await getContent(locale, "header");
  return {
    props: {
      landingPageContent,
      headerContent,
    },
  };
}

export default Index;
