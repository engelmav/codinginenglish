import React from "react";
import { cieApi } from "../services/cieApi";
import UpcomingSessions from "../UpcomingSessions";
import Layout from "../components/Layout";
import settings from "../settings";

const UpcomingSessionsPage = ({ cieModules }) => {
  return (
    <Layout>
      <UpcomingSessions cieModules={cieModules} />
    </Layout>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  let cieModules = [];
  try {
    const result = await fetch(`${settings.cieApiUrl}/api/cie-modules`);
    const data = await result.json();
    console.log(data)
    if (data === null || data === undefined) {
      console.log(
        "*** WARNING: null or undefined result of getUpcomingModulesAndSessions() in getServerSideProps()"
      );
    } else {
      cieModules = data.data;
    }
  } catch (ex) {
    console.log("Failed to retrieve scheduledSessions.");
    console.log(ex.stack);
  }

  return { props: { cieModules } };
}

export default UpcomingSessionsPage;
