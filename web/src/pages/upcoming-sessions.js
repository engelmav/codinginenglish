import React from "react";
import { UpcomingSessions } from "../rootProd";
import Layout from "../components/Layout";
import { cieApi } from "../services/cieApi";

const UpcomingSessionsPage = ({cieModules}) => {
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
    console.log("UpcomingSessions.init()");
    const result = await cieApi.getUpcomingModulesAndSessions();
    cieModules = result.data;
    console.log(
      "**************************** result of result.data:",
      cieModules
    );
    if ((cieModules === null) | (cieModules === undefined)) {
      throw new Error("cieModules is null or undefined");
    }
  } catch (ex) {
    console.log("Failed to retrieve scheduledSessions.");
    console.log(ex.stack);
  }

  return { props: { cieModules } };
}

export default UpcomingSessionsPage;
