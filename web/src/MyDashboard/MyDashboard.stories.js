import React from "react";
import { MyDashboard } from "./MyDashboard";
import { AppStore } from "../stores/AppStore";
import { createBrowserHistory } from "history";
import { Router } from "react-router";

export default {
  title: "Views/MyDashboard",
  component: MyDashboard,
};

const appStore = new AppStore();
appStore.firstName = "Test User First Name";

const oneRegistration = [
  {
    module_name: "Test Module Name",
    start_date: "Some date",
  },
];


class DummyApi {
  registrations;
  getFutureUserRegistrations(){
    return this.registrations;
  }
}
const cieApi = new DummyApi();
cieApi.registrations = oneRegistration;

let props = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
  },
  cieApi,
  appStore,
};

const history = createBrowserHistory();

export const WithRegistrations = () => (
  <Router history={history}>
    <MyDashboard {...props} />;
  </Router>
);

const cieApi2 = new DummyApi()
cieApi2.registrations = []

const props2 = {
  cieApi: cieApi2,
  appStore
}

export const WithoutRegistrations = () => (
  <Router history={history}>
    <MyDashboard {...props2} />;
  </Router>
);