import addTimestampsToLog from "./log";
import { App as _App } from "./App";
// import { makeAppStore } from "./stores/AppStore";
import appStoreLazy from "./stores/AppStoreLazy";
import { AuthLazy } from "./auth/AuthLazy";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { InstructorApi } from "./services/InstructorApi";
import { compose, observableCompose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
import { Footer as _Footer } from "./Footer/Footer";
import _Header from "./Header";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import StudentSessionManager from "./services/studentSessionManager";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";
import React, { useEffect } from "react";
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
import { default as _InstructorPanel } from "./InstructorPanel/InstructorPanel";
import { Collab as _Collab } from "./PopupActivity/Collab/Collab";
import { default as _DragToImageCollab } from "./PopupActivity/DragToImageCollab/DragToImageCollab";
import { Aula as _Classroom } from "./Aula";
import { MyDashboard as _MyDashboard } from "./MyDashboard/MyDashboard";
import { default as _CheckoutForm } from "./CheckoutForm/CheckoutForm";
import { default as AboutUs } from "./AboutUs";
import { Timeline } from "./CourseApplications/Timeline";
import { default as _ApplicationProcess } from "./CourseApplications/ApplicationProcess";
import { default as _Register } from "./CourseApplications/Register";
import { default as _NextSteps } from "./CourseApplications/NextSteps";
import { PopupActivity as _PopupActivity } from "./PopupActivity/PopupActivity";
import { MultipleChoice as _MultipleChoice } from "./PopupActivity/MultipleChoice/MultipleChoice";

// const LazyProps = ({ children }) => {
//   const [childrenWithLoadedProps, setchildrenWithLoadedProps] = useState(null);
//   async function loadLazyProps(children){
//     const loaded = React.Children.map(children, (child) => {
//       let loadedProps = {};
//       if (!React.isValidElement(child)) return;
//       const childProps = child.props;
//       for (const prop in childProps) {
//         const mightLoad = props[prop];
//         if (typeof mightLoad.lazyLoad === "function") {
//           const loadedProp = mightLoad.lazyLoad();
//           loadedProps[prop] = loadedProp;
//         }
//       }
//       return React.cloneElement(child, {...loadedProps})
//     });
//   }
//   return <>{children}</>;
// };

addTimestampsToLog();

const authLazy = new AuthLazy(appStoreLazy);
const baseProps = { authLazy, appStoreLazy, settings };
export const cieApi = new CieApi(settings);
const websocketManager = new WebsocketManager(settings);

const Login = compose(_Login, { ...baseProps });

export const Header = compose(_Header, { ...baseProps, Login });
export const Footer = compose(_Footer, { Login });

const trackingId = "UA-199972795-1";
ReactGA.initialize(trackingId);
Router.events.on("routeChangeStart", () => {
  ReactGA.pageview(location.pathname);
  window.scrollTo(0, 0);
});

async function handleAuthSuccess(authResult) {
  const appStore = await appStoreLazy.load();
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
  // studentSessionMgr.initialize();
  let nextPage = "/my-dashboard";
  if (appStore.flow === "newRegistration") {
    nextPage = "/apply/next-steps";
  }
  Router.push(nextPage);
}
reactor.registerEvent("auth_success");
reactor.addEventListener("auth_success", handleAuthSuccess);
// const Footer = compose(_Footer, { appStore, auth, Login });

const CheckoutForm = compose(_CheckoutForm, { appStoreLazy, settings });
const ModuleCard = compose(_ModuleCard, {
  cieApi,
  appStoreLazy,
  settings,
  CheckoutForm,
});
export const UpcomingSessions = compose(_UpcomingSessions, {
  cieApi,
  authLazy,
  appStoreLazy,
  ModuleCard,
});

/** Configure Aula */
const instructorApi = new InstructorApi();
const InstructorPanel = compose(_InstructorPanel, {
  appStoreLazy,
  instructorApi,
});
const Collab = compose(_Collab, { cieApi, appStoreLazy });
const MultipleChoice = compose(_MultipleChoice, { cieApi });
const DragToImageCollab = compose(_DragToImageCollab, {
  appStoreLazy,
  cieApi,
  settings,
});

const PopupActivity = compose(_PopupActivity, {
  appStoreLazy,
  Collab,
  MultipleChoice,
  DragToImageCollab,
  websocketManager,
});
const withAuth = createWithAuth(authLazy);

const _ClassroomInjected = compose(_Classroom, {
  appStoreLazy,
  cieApi,
  settings,
  InstructorPanel,
  PopupActivity,
  websocketManager,
});

const Classroom = withAuth(_ClassroomInjected);
/** End Configure Aula */

export const Register = compose(_Register, { Timeline, appStoreLazy, authLazy, cieApi });
export const NextSteps = compose(_NextSteps, {
  Timeline,
  appStoreLazy,
  authLazy,
  cieApi,
});
export const ApplicationProcess = compose(_ApplicationProcess, {
  appStoreLazy,
  cieApi,
  Register,
  NextSteps,
});
export const CallbackRoute = compose(Callback, {
  appStoreLazy,
  authLazy,
  cieApi,
});
const MyDashboard = compose(_MyDashboard, { authLazy, appStoreLazy, cieApi });
const CollabEditor = compose(_Collab, { appStoreLazy, editorMode: true });
const routesProps = {
  appStoreLazy,
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
  appStoreLazy,
  authLazy,
  Routes,
});
