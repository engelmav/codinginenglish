import React from "react";
import UpcomingSessions from "../UpcomingSessions";
import Layout from "../components/Layout";
import settings from "../settings";
import getContent from "../cms";

const UpcomingSessionsPage = (props) => {
  return (
    <Layout {...props}>
      <UpcomingSessions {...props} />
    </Layout>
  );
};

// This gets called on every request
export async function getStaticProps(params) {
  let locale = params?.locale;
  if (locale === undefined || locale === null){
    locale = "en"
  }
  const headerContent = await getContent(locale, "header");
  let cieModules = [];
  try {
    const coursesUrl = `${settings.cmsUrl}/courses`;
    const result = await fetch(coursesUrl);

    const data = await result.json();
    if (data === null || data === undefined) {
      console.log(
        "*** WARNING: null or undefined result of getUpcomingModulesAndSessions() in getServerSideProps()"
      );
    } else {
      cieModules = data;
    }
  } catch (ex) {
    console.log("Failed to retrieve scheduledSessions.");
    console.log(ex.stack);
  }

  return { props: { cieModules, headerContent } };
}

export default UpcomingSessionsPage;
