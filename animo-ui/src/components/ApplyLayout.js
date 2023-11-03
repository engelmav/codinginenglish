import Layout from "./Layout";
import React from "react";
import { ApplicationProcess } from "../rootProd";

const ApplicationLayout = ({ children }) => {
  return (
    <Layout>
      <ApplicationProcess>{children}</ApplicationProcess>
    </Layout>
  );
};

export default ApplicationLayout;