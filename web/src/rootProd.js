import { App as _App } from "./App";
import { PopupActivity as _PopupActivity } from "./PopupActivity/PopupActivity";
import { MultipleChoice as _MultipleChoice } from "./PopupActivity/MultipleChoice/MultipleChoice";
import { DragToImageCollab as _DragToImageCollab } from "./PopupActivity/DragToImageCollab/DragToImageCollab";
// import { Collab as _Collab } from "./PopupActivity/Collab/Collab"
// import { Aula as _Classroom } from "./Aula";
import { Auth } from "./auth/Auth";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { InstructorApi } from "./services/InstructorApi";
import { CheckoutForm as _CheckoutForm } from "./CheckoutForm/CheckoutForm";
import { compose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
import { Header as _Header } from "./Header";
import { Footer as _Footer } from "./Footer/Footer";
import { Login as _Login } from "./Login/Login";
import history from "./history";
import { Home as _Home } from "./Home";
import { ModuleCard as _ModuleCard } from "./ModuleCard/ModuleCard";
import { MyDashboard as _MyDashboard } from "./MyDashboard/MyDashboard";
import { AboutUs } from "./AboutUs";
import { BasicCourseForm as _Application } from "./CourseApplications/BasicCourse";
import { ApplicationProcess as _ApplicationProcess } from "./CourseApplications/ApplicationProcess";
import { Register as _Register } from "./CourseApplications/Register";
import { NextSteps as _NextSteps } from "./CourseApplications/NextSteps";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import { StudentSessionManager } from "./util";
import { UpcomingSessions as _UpcomingSessions } from "./UpcomingSessions";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";
import { InstructorPanel as _InstructorPanel } from "./InstructorPanel/InstructorPanel";
import React from "react";
import ReactGA from "react-ga";


const _Classroom = React.lazy(() => import("./Aula"));
const _Collab = React.lazy(() => import("./PopupActivity/Collab/Collab"));

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



export function main(appStore) {
  const cieApi = new CieApi();
  const websocketManager = new WebsocketManager(settings);
  const auth = new Auth(appStore);
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

  const Login = compose(_Login, { auth, appStore });
  const Header = compose(_Header, { appStore, auth, settings, Login });
  const Footer = compose(_Footer, { appStore, auth, Login });

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
  // const Application = compose(_Application, { appStore, cieApi });
  const Register = compose(_Register, { appStore, auth, cieApi });
  const NextSteps = compose(_NextSteps, { appStore, auth, cieApi });

  const ApplicationProcess = compose(_ApplicationProcess, {
    appStore,
    cieApi,
    Register,
    NextSteps,
  });
  const CallbackRoute = compose(CallbackWithRouter, { appStore, auth, cieApi });
  const Home = compose(_Home, { auth, cieApi, settings });
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
    Home,
    MyDashboard,
    UpcomingSessions,
  };

  const Routes = compose(_Routes, routesProps);

  const App = compose(_App, { appStore, auth, Header, Routes, Footer, history });
  return App;
}
