import React from "react";
import { Home } from "./";
import { Router } from "react-router";

export default {
  title: "Views/Home",
  component: Home,
};

const props = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
  },
};

import { createBrowserHistory } from 'history'
const history = createBrowserHistory();

export const DefaultView = () => (
  <Router history={history}>
    <Home {...props} />
  </Router>
);
