import React from "react";
import settings from "../settings";
import { LandingPage } from "./LandingPage";
export default function Index() {
  return <LandingPage settings={settings}/>;
  // return <div>custom key: {process.env.ENVIRONMENT}</div>
}
