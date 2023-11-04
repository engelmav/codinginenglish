import React from "react";
import UpcomingSessions from "../UpcomingSessions";
import Layout from "../components/Layout";
import getContent from "../cms";
import { AppStoreProvider } from "../stores/appStoreReact";

const Courses = (props) => {
  return (
    <AppStoreProvider>
      <Layout {...props}>
        <UpcomingSessions {...props} />
      </Layout>
    </AppStoreProvider>
  );
};

// This gets called on every request
export async function getStaticProps(params) {
  let locale = params?.locale;
  if (locale === undefined || locale === null) {
    locale = "en";
  }
  const headerContent = await getContent(locale, "header");
  const footerContent = await getContent(locale, "footer");
  const localizedCommon = await getContent(locale, "common");
  const mailingListComponentContent = await getContent(
    locale,
    "mailing-list-component"
  );
  const cieModules = await getContent(locale, "courses");
  return {
    props: {
      cieModules,
      headerContent,
      footerContent,
      mailingListComponentContent,
      localizedCommon
    },
  };
}

export default Courses;
