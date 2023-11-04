import React from "react";
import { compose } from "../compose";
import { makeAppStore } from "../stores/AppStore";
import { ModuleCard as _ModuleCard } from "../ModuleCard/ModuleCard";
import { createBrowserHistory } from "history";
import { Router } from "react-router";

const mockSettings = {
  assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
};

const appStore = makeAppStore();
const settings = mockSettings;
const moduleData = {
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa porro quae animi quos accusantium esse amet! Cupiditate, corrupti. Quo velit debitis optio, vel deleniti tempore modi facilis labore. Nam.",
  id: 1,
  image_path: null,
  module_sessions: [
    { _session_datetime: "2021-04-01T19:45:39.723160", id: 1 },
    { _session_datetime: "2021-04-01T09:45:39.723160", id: 2 },
  ],
  name: "Web App Development - Intermediate",
};

const CheckoutForm = () => <div>I am a nonsense checkout form</div>;

const ModuleCard = compose(_ModuleCard, {
  appStore,
  moduleData,
  settings,
  CheckoutForm,
});

const history = createBrowserHistory();

export default {
  title: "ModuleCard",
  component: ModuleCard,
};

export const DefaultView = () => (
  <Router history={history}>
    <ModuleCard />
  </Router>
);
