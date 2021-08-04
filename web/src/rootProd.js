import addTimestampsToLog from "./log";
import { App as _App } from "./App";
import { makeAppStore } from "./stores/AppStore";
import { AuthLazy } from "./auth/AuthLazy";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { InstructorApi } from "./services/InstructorApi";
import { compose, observableCompose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
import { Footer as _Footer } from "./Footer/Footer";
import _Header from "./Header";
import { default as _LandingPage } from "./LandingPage/LandingPage";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import StudentSessionManager from "./services/studentSessionManager";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";
import React from "react";
import ReactGA from "react-ga";
import reactor from "./reactor";
import Router from "next/router";
import { default as _UpcomingSessions } from "./UpcomingSessions";
// const _UpcomingSessions = React.lazy(() => import("./UpcomingSessions"));
import { default as _ModuleCard } from "./ModuleCard/ModuleCard";
// const _ModuleCard = React.lazy(() => {
//   console.log("Lazy loading ModuleCard");
//   return import("./ModuleCard/ModuleCard");
// });
import { default as _Login } from "./Login/Login";
// const _Login = React.lazy(() => {
//   const Login = import("./Login/Login");
//   return Login;
// });
import { InstructorPanel as _InstructorPanel } from "./InstructorPanel/InstructorPanel";
import { default as _Collab } from "./PopupActivity/Collab/Collab";
import { default as _DragToImageCollab } from "./PopupActivity/DragToImageCollab/DragToImageCollab";
import { default as _Classroom } from "./Aula";
import { default as _MyDashboard } from "./MyDashboard/MyDashboard";
import { default as _CheckoutForm } from "./CheckoutForm/CheckoutForm";
import { default as AboutUs } from "./AboutUs";
import { default as _ApplicationProcess } from "./CourseApplications/ApplicationProcess";
import { default as _Register } from "./CourseApplications/Register";
import { default as _NextSteps } from "./CourseApplications/NextSteps";
import { default as _PopupActivity } from "./PopupActivity/PopupActivity";
import { default as _MultipleChoice } from "./PopupActivity/MultipleChoice/MultipleChoice";

addTimestampsToLog();

const appStore = makeAppStore();

const authLazy = new AuthLazy(appStore);
const baseProps = { authLazy, appStore, settings };
export const cieApi = new CieApi(settings);
const websocketManager = new WebsocketManager(settings);

const Login = compose(_Login, { ...baseProps });

export const Header = compose(_Header, { ...baseProps, Login });
export const Footer = compose(_Footer, { Login });
export const LandingPage = compose(_LandingPage, { settings });

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);
Router.events.on("routeChangeStart", () => {
  ReactGA.pageview(location.pathname);
  window.scrollTo(0, 0);
});

async function handleAuthSuccess(authResult) {
  const initializedUser = await cieApi.initializeUser(authResult);
  appStore.user = initializedUser;
  const userData = initializedUser.data.user;
  appStore.configureUser(
    authResult,
    userData,
    initializedUser.data.rocketchat_auth_token
  );
  const websocket = await websocketManager.createWebsocket(
    `ws-general-user-${appStore.userId}`
  );
  const studentSessionMgr = new StudentSessionManager(websocket);
  studentSessionMgr.addOnSessionStart(appStore.setSessionInProgress);
  appStore.setSessionInProgress(initializedUser.data.has_session_in_progress);
  studentSessionMgr.initialize();
  let nextPage = "/my-dashboard";
  if (appStore.flow === "newRegistration") {
    nextPage = "/apply/next-steps";
  }
  Router.push(nextPage);
}
reactor.registerEvent("auth_success");
reactor.addEventListener("auth_success", handleAuthSuccess);
// const Footer = compose(_Footer, { appStore, auth, Login });

const CheckoutForm = compose(_CheckoutForm, { appStore, settings });
const ModuleCard = compose(_ModuleCard, {
  cieApi,
  appStore,
  settings,
  CheckoutForm,
});
export const UpcomingSessions = compose(_UpcomingSessions, {
  cieApi,
  authLazy,
  appStore,
  ModuleCard,
});

/** Configure Aula */
const instructorApi = new InstructorApi();
const InstructorPanel = compose(_InstructorPanel, {
  appStore,
  instructorApi,
});
const Collab = compose(_Collab, { cieApi, appStore });
const MultipleChoice = compose(_MultipleChoice, { cieApi });
const DragToImageCollab = compose(_DragToImageCollab, {
  appStore,
  cieApi,
  settings,
});

const PopupActivity = compose(_PopupActivity, {
  appStore,
  Collab,
  MultipleChoice,
  DragToImageCollab,
  websocketManager,
});
const withAuth = createWithAuth(authLazy);

const _ClassroomInjected = compose(_Classroom, {
  appStore,
  cieApi,
  settings,
  InstructorPanel,
  PopupActivity,
  websocketManager,
});

const Classroom = withAuth(_ClassroomInjected);
/** End Configure Aula */

export const Register = compose(_Register, { appStore, authLazy, cieApi });
export const NextSteps = compose(_NextSteps, { appStore, authLazy, cieApi });

export const ApplicationProcess = compose(_ApplicationProcess, {
  appStore,
  cieApi,
  Register,
  NextSteps,
});
export const CallbackRoute = compose(Callback, {
  appStore,
  authLazy,
  cieApi,
});
const MyDashboard = compose(_MyDashboard, { authLazy, appStore, cieApi });
const CollabEditor = compose(_Collab, { appStore, editorMode: true });
const routesProps = {
  appStore,
  authLazy,
  cieApi,
  AboutUs,
  ApplicationProcess,
  CallbackRoute,
  Classroom,
  CollabEditor,
  MyDashboard,
  UpcomingSessions,
};

const Routes = compose(_Routes, routesProps);

const App = compose(_App, {
  appStore,
  authLazy,
  Routes,
});
