import { App as _App } from './App';
import { AppStore } from './stores/AppStore';
import { Aula as _Classroom } from './Aula';
import { Auth } from './auth/Auth';
import Callback from './auth/Auth0Callback';
import { CieApi } from './services/cieApi';
import { CheckoutForm as _CheckoutForm } from './CheckoutForm';
import { compose } from './compose';
import { createWithAuth } from './auth/RequiresAuth';
import { Header as _Header } from './Header';
import history from './history';
import { Home as _Home } from './Home';
import { ModuleCard as _ModuleCard } from './ModuleCard';
import { MyDashboard as _MyDashboard } from './MyDashboard'
import { Routes as _Routes } from './Routes';
import settings from './settings';
import { StudentSessionManager } from './util';
import { UpcomingSessions as _UpcomingSessions } from './UpcomingSessions';
import { withRouter } from 'react-router-dom';


const cieApi = new CieApi();
const appStore = new AppStore();

const studentSessionMgr = new StudentSessionManager(EventSource);
studentSessionMgr.start();
studentSessionMgr.addOnSessionStart(appStore.setSessionInProgress);

const auth = new Auth(appStore);

async function initializeUser(authResult) {
  console.log("Initializing user...");
  const initializedUser = await cieApi.initializeUser(authResult);
  appStore.user = initializedUser;
  const userData = initializedUser.data.user;
  appStore.configureUser(authResult, userData, initializedUser.data.rocketchat_auth_token);
  const userRegistrations = await cieApi.getFutureUserRegistrations(userData.id)
  console.log("userRegistrations:", userRegistrations);
  studentSessionMgr.start();
  history.push('/my-dashboard');
}

auth.addOnAuthSuccess(initializeUser);
auth.addOnLogout(appStore.resetStore)


const Header = compose(_Header, { appStore, auth });

const CheckoutForm = compose(_CheckoutForm, { appStore });
const ModuleCard = compose(_ModuleCard, { cieApi, appStore, settings, CheckoutForm });
const UpcomingSessions = compose(_UpcomingSessions,
  { cieApi, auth, appStore, ModuleCard })

const withAuth = createWithAuth(auth);

const { authData } = appStore;
const _ClassroomInjected = compose(_Classroom, { appStore, authData, cieApi, settings });

const Classroom = withAuth(_ClassroomInjected);
const CallbackWithRouter = withRouter(Callback);
const CallbackRoute = compose(CallbackWithRouter, { appStore, auth, cieApi });
const Home = compose(_Home, { auth, cieApi });
const MyDashboard = compose(_MyDashboard, { auth, appStore, cieApi });
const routesProps = {
  appStore,
  auth,
  cieApi,
  CallbackRoute,
  Classroom,
  Home,
  MyDashboard,
  UpcomingSessions,
};

const Routes = compose(_Routes, routesProps);

const App = compose(_App, { appStore, auth, Header, Routes })


export {
  App,
  Routes,
  UpcomingSessions,
  appStore,
  auth,
  withAuth
};
