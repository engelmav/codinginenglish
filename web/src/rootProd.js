import addTimestampsToLog from "./log";
import { App as _App } from "./App";
import { makeAppStore } from "./stores/AppStore";
import Auth from "./auth/Auth";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { InstructorApi } from "./services/InstructorApi";
import { compose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
import { Footer as _Footer } from "./Footer/Footer";
import history from "./history";
import _Header from "./Header"
import { Home as _Home } from "./Home";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import { StudentSessionManager } from "./util";
import { UpcomingSessions as _UpcomingSessions } from "./UpcomingSessions";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";
import React from "react";
import ReactGA from "react-ga";


addTimestampsToLog();


var appStore = makeAppStore();
var auth = new Auth(appStore)

const baseProps = {auth, appStore, settings}

const _Login = React.lazy(() => {
  const Login = import("./Login/Login");
  return Login;
});

const Login = compose(_Login, {...baseProps});


export const Header = compose(_Header, {...baseProps, Login})
export const Footer = compose(_Footer, { Login })


export const Home = compose(_Home, { settings });


const _Collab = React.lazy(() => {
  console.log("importing _Collab");
  return import(
    /* webpackChunkName: "Collab" */ "./PopupActivity/Collab/Collab"
  );
});

const _DragToImageCollab = React.lazy(() => {
  console.log("Lazy loading DragToImageCollab");
  return import(
    /* DragToImageCollab: "DragToImageCollab" */ "./PopupActivity/DragToImageCollab/DragToImageCollab"
  );
});

const _Classroom = React.lazy(() =>
  import(/* webpackChunkName: "Aula" */ "./Aula")
);

// import { InstructorPanel as _InstructorPanel } from "./InstructorPanel/InstructorPanel";
const _InstructorPanel = React.lazy(() =>
  import("./InstructorPanel/InstructorPanel")
);

const _MyDashboard = React.lazy(() => {
  import("./MyDashboard/MyDashboard");
});
const _CheckoutForm = React.lazy(() =>
  import(/* webpackChunkName: "CheckoutForm" */ "./CheckoutForm/CheckoutForm")
);

const AboutUs = React.lazy(() => {
  return import("./AboutUs");
});

const _ApplicationProcess = React.lazy(() => {
  return import("./CourseApplications/ApplicationProcess");
});

const _Register = React.lazy(() => {
  return import("./CourseApplications/Register");
});
const _NextSteps = React.lazy(() => {
  return import("./CourseApplications/NextSteps");
});

const _ModuleCard = React.lazy(() => {
  console.log("Lazy loading ModuleCard");
  return import("./ModuleCard/ModuleCard");
});

const _PopupActivity = React.lazy(() =>
  import("./PopupActivity/PopupActivity")
);
const _MultipleChoice = React.lazy(() =>
  import("./PopupActivity/MultipleChoice/MultipleChoice")
);

export function makeApp() {
  const appStore = makeAppStore();
  const auth = new Auth(appStore)
  const cieApi = new CieApi();
  const websocketManager = new WebsocketManager(settings);
  
  const trackingId = "UA-199972795-1";
  ReactGA.initialize(trackingId);

  history.listen((location) => {
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
    history.push(nextPage);
  }

  auth.addOnAuthSuccess(handleAuthSuccess);
  auth.addOnLogout(appStore.clearStore);

  // const Footer = compose(_Footer, { appStore, auth, Login });

  const CheckoutForm = compose(_CheckoutForm, { appStore, settings });
  const ModuleCard = compose(_ModuleCard, {
    cieApi,
    appStore,
    settings,
    CheckoutForm,
  });
  const UpcomingSessions = compose(_UpcomingSessions, {
    cieApi,
    auth,
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
  const withAuth = createWithAuth(auth);

  const { authData } = appStore;
  const _ClassroomInjected = compose(_Classroom, {
    appStore,
    authData,
    cieApi,
    settings,
    InstructorPanel,
    PopupActivity,
    websocketManager,
  });

  const Classroom = withAuth(_ClassroomInjected);
  /** End Configure Aula */

  const CallbackWithRouter = withRouter(Callback);
  const Register = compose(_Register, { appStore, auth, cieApi });
  const NextSteps = compose(_NextSteps, { appStore, auth, cieApi });

  const ApplicationProcess = compose(_ApplicationProcess, {
    appStore,
    cieApi,
    Register,
    NextSteps,
  });
  const CallbackRoute = compose(CallbackWithRouter, { appStore, auth, cieApi });
  const MyDashboard = compose(_MyDashboard, { auth, appStore, cieApi });
  const CollabEditor = compose(_Collab, { appStore, editorMode: true });
  const routesProps = {
    appStore,
    auth,
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
    auth,
    Routes,
    history,
  });
  return App;
}
