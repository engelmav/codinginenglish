import { App as _App } from "./App";
// import { PopupActivity as _PopupActivity } from "./PopupActivity/PopupActivity";
// import { MultipleChoice as _MultipleChoice } from "./PopupActivity/MultipleChoice/MultipleChoice";
// import { DragToImageCollab as _DragToImageCollab } from "./PopupActivity/DragToImageCollab/DragToImageCollab";
// import { Collab as _Collab } from "./PopupActivity/Collab/Collab"
// import { Aula as _Classroom } from "./Aula";
import { makeAppStore } from "./stores/AppStore";
import makeAuth from "./auth/Auth";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { InstructorApi } from "./services/InstructorApi";
// import { CheckoutForm as _CheckoutForm } from "./CheckoutForm/CheckoutForm";
import { compose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
// import { Header as _Header } from "./Header";
import { Footer as _Footer } from "./Footer/Footer";
import history from "./history";
import { Home as _Home } from "./Home";
// import { ModuleCard as _ModuleCard } from "./ModuleCard/ModuleCard";
// import { MyDashboard as _MyDashboard } from "./MyDashboard/MyDashboard";
// import { AboutUs } from "./AboutUs";
// import { BasicCourseForm as _Application } from "./CourseApplications/BasicCourse";
// import { ApplicationProcess as _ApplicationProcess } from "./CourseApplications/ApplicationProcess";
// import { Register as _Register } from "./CourseApplications/Register";
// import { NextSteps as _NextSteps } from "./CourseApplications/NextSteps";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import { StudentSessionManager } from "./util";
import { UpcomingSessions as _UpcomingSessions } from "./UpcomingSessions";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";
// import { InstructorPanel as _InstructorPanel } from "./InstructorPanel/InstructorPanel";
import React from "react";
import ReactGA from "react-ga";


let appStoreSingleton;
let authSingleton;

async function makeAppStoreSingleton(){
  if (appStoreSingleton) return appStoreSingleton;
  appStoreSingleton = await makeAppStore();
  return appStoreSingleton;
}

async function makeAuthSingleton() {
  if (authSingleton) return authSingleton;
  authSingleton = await makeAuth();
  return authSingleton;
}

const _Login = React.lazy(() => {
  const Login = import("./Login/Login");
  return Login;
});  

async function makeLazyLogin() {
  const appStore = await makeAppStoreSingleton()
  const Auth = await makeAuthSingleton();
  const auth = new Auth(appStore);
  const Login = compose(_Login, { auth, appStore });
  return Login
}

export async function makeLazyHeader(){
  const _Header = React.lazy(() => {
    console.log("Lazy loading _Header");
    const Header = import("./Header");
    return Header;
  }); 

  const Login = await makeLazyLogin();
  const appStore = makeAppStoreSingleton();
  const Header = compose(_Header, { appStore, settings,
     Login 
    });
  return Header;
}

export async function makeLazyFooter(){
  const Login = makeLazyLogin();
  const Footer = compose(_Footer, { Login })
  return Footer;
}

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
  console.log("Lazy loading MyDashboard");

  import("./MyDashboard/MyDashboard");
});
const _CheckoutForm = React.lazy(() =>
  import(/* webpackChunkName: "CheckoutForm" */ "./CheckoutForm/CheckoutForm")
);

const AboutUs = React.lazy(() => {
  console.log("Lazy loading AboutUs");
  return import("./AboutUs");
});

const _ApplicationProcess = React.lazy(() => {
  console.log("Lazy loading _ApplicationProcess");
  return import("./CourseApplications/ApplicationProcess");
});

const _Register = React.lazy(() => {
  console.log("Lazy loading Register");
  return import("./CourseApplications/Register");
});
const _NextSteps = React.lazy(() => {
  console.log("Lazy loading NextSteps");
  return import("./CourseApplications/NextSteps");
});

const _ModuleCard = React.lazy(() => {
  console.log("Lazy loading ModuleCard");
  return import("./ModuleCard/ModuleCard");
});

const _PopupActivity = React.lazy(() =>
  import(
    /* webpackChunkName: "PopupActivity" */ "./PopupActivity/PopupActivity"
  )
);
const _MultipleChoice = React.lazy(() =>
  import(
    /* webpackChunkName: "MultipleChoice" */ "./PopupActivity/MultipleChoice/MultipleChoice"
  )
);


var log = console.log;

console.log = function () {
  var first_parameter = arguments[0];
  var other_parameters = Array.prototype.slice.call(arguments, 1);

  function formatConsoleDate(date) {
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    return (
      "[" +
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds) +
      "." +
      ("00" + milliseconds).slice(-3) +
      "] "
    );
  }

  log.apply(
    console,
    [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters)
  );
};

export async function makeApp() {
  const appStore = makeAppStoreSingleton();
  const Auth = await makeAuthSingleton(appStore);
  const auth = new Auth(appStore);
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
