import React from "react";
import { MyDashboard } from "./MyDashboard";
import { makeAppStore } from "../stores/AppStore";
import { createBrowserHistory } from "history";
import { Router } from "react-router";

export default {
  title: "Views/MyDashboard",
  component: MyDashboard,
};

const appStoreWithName = new makeAppStore("withname");
appStoreWithName.setFirstname("Test user first name");
const appStoreNoName = makeAppStore("noname");
appStoreNoName.setFirstname(null);

const oneRegistration = [
  {
    module_name: "Test Module Name",
    start_date: "Some date",
  },
];


class DummyApi {
  registrations;
  getUpcomingRegistrationsByUserId(){
    return this.registrations;
  }
  saveUser(userData){
    alert("User data:", userData)
  }
}
const cieApi = new DummyApi();
cieApi.registrations = oneRegistration;

let propsWithRegistrations = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
  },
  cieApi,
  appStore: appStoreWithName,
};

const history = createBrowserHistory();

export const WithRegistrations = () => (
  <Router history={history}>
    <MyDashboard {...propsWithRegistrations} />
  </Router>
);

const cieApi2 = new DummyApi()
cieApi2.registrations = []

const propsWithoutRegistrations = {
  cieApi: cieApi2,
  appStore: appStoreWithName
}

export const WithoutRegistrations = () => (
  <Router history={history}>
    <MyDashboard {...propsWithoutRegistrations} />
  </Router>
);

const propsNoName = {
  cieApi: cieApi2,
  appStore: appStoreNoName
}

export const WithoutUnknownName = () => (
  <Router history={history}>
    <MyDashboard {...propsNoName} />
  </Router>
);
