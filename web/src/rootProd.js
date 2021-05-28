import { App as _App } from "./App";
import { PopupActivity as _PopupActivity } from "./PopupActivity/PopupActivity";
import { MultipleChoice as _MultipleChoice } from "./PopupActivity/MultipleChoice/MultipleChoice";
import { DragToImageCollab as _DragToImageCollab } from "./PopupActivity/DragToImageCollab/DragToImageCollab";
import { Collab as _Collab } from "./PopupActivity/Collab/Collab"
import { Aula as _Classroom } from "./Aula";
import { Auth } from "./auth/Auth";
import Callback from "./auth/Auth0Callback";
import { CieApi } from "./services/cieApi";
import { CheckoutForm as _CheckoutForm } from "./CheckoutForm/CheckoutForm";
import { compose } from "./compose";
import { createWithAuth } from "./auth/RequiresAuth";
import { Header as _Header } from "./Header";
import { Footer as _Footer } from "./Footer/Footer";
import { Login as _Login } from "./Login";
import history from "./history";
import { Home as _Home } from "./Home";
import { ModuleCard as _ModuleCard } from "./ModuleCard/ModuleCard";
import { MyDashboard as _MyDashboard } from "./MyDashboard/MyDashboard";
import { AboutUs } from "./AboutUs";
import { Routes as _Routes } from "./Routes";
import settings from "./settings";
import { StudentSessionManager } from "./util";
import { UpcomingSessions as _UpcomingSessions } from "./UpcomingSessions";
import { withRouter } from "react-router-dom";
import { WebsocketManager } from "./messaging";

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

  async function initializeUser(authResult) {
    console.log("Initializing user...");
    const initializedUser = await cieApi.initializeUser(authResult);
    appStore.user = initializedUser;
    const userData = initializedUser.data.user;
    appStore.configureUser(
      authResult,
      userData,
      initializedUser.data.rocketchat_auth_token
    );
    const websocket = websocketManager.createWebsocket(
      `ws-general-user-${appStore.userId}`
    );
    const studentSessionMgr = new StudentSessionManager(websocket);
    studentSessionMgr.addOnSessionStart(appStore.setSessionInProgress);
    console.log("initializedUser.data.has_session_in_progress:", initializedUser.data.has_session_in_progress)
    appStore.setSessionInProgress(initializedUser.data.has_session_in_progress);
    studentSessionMgr.initialize();
    history.push("/my-dashboard");
  }
  auth.addOnAuthSuccess(initializeUser);
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
  const Collab = compose(_Collab, { cieApi, appStore });
  const MultipleChoice = compose(_MultipleChoice, { cieApi });
  const DragToImageCollab = compose(_DragToImageCollab, {
    appStore,
    cieApi,
    settings,
  });

  const PopupActivity = compose(_PopupActivity, {
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
    PopupActivity,
    websocketManager,
  });

  const Classroom = withAuth(_ClassroomInjected);
  /** End Configure Aula */

  const CallbackWithRouter = withRouter(Callback);
  const CallbackRoute = compose(CallbackWithRouter, { appStore, auth, cieApi });
  const Home = compose(_Home, { auth, cieApi, settings });
  const MyDashboard = compose(_MyDashboard, { auth, appStore, cieApi });
  const CollabEditor = compose(_Collab, { appStore, editorMode: true })
  const routesProps = {
    appStore,
    auth,
    cieApi,
    AboutUs,
    CallbackRoute,
    Classroom,
    CollabEditor,
    Home,
    MyDashboard,
    UpcomingSessions,
  };

  const Routes = compose(_Routes, routesProps);

  const App = compose(_App, { appStore, auth, Header, Routes, Footer });
  return App;
}
