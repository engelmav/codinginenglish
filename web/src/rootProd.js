import { App as _App } from './App';
import { Auth } from './auth/Auth';
import { CieApi } from './services/cieApi';
import { StudentSessionManager } from './util';
import { AppStore } from './stores/AppStore';
import Callback from './auth/Auth0Callback';
import { withRouter } from 'react-router-dom';
import { Header as _Header } from './Header';
import history from './history';
import { Home as _Home } from './Home';
import { MyDashboard as _MyDashboard } from './MyDashboard';
import { UpcomingSessions as _UpcomingSessions } from './UpcomingSessions';
import { Routes as _Routes } from './Routes';
import settings from './settings';
import { ModuleCard as _ModuleCard } from './ModuleCard';
import { createWithAuth } from './auth/RequiresAuth';
import { Aula as _Classroom } from './Aula';
import { compose } from './compose';


const cieApi = new CieApi();
const appStore = new AppStore();

const studentSessionMgr = new StudentSessionManager(EventSource);
studentSessionMgr.start();
studentSessionMgr.addOnSessionStart(appStore.setSessionInProgress);

const auth = new Auth(appStore);



async function initializeUser(authResult) {
  const initializedUser = await cieApi.initializeUser(authResult);
  appStore.user = initializedUser;
  const userData = initializedUser.data.user;
  appStore.configureUser(authResult, userData);
  const userRegistrations = await cieApi.getUserRegistrations(userData.id)
  console.log("Got userRegistrations:", userRegistrations);
  appStore.registeredSessions = userRegistrations;
  // Start studentSessionManager on successful login.
  studentSessionMgr.start();
  history.push('/my-dashboard');
}

auth.addOnAuthSuccess(initializeUser);

const Header = compose(_Header, { appStore, auth });
const ModuleCard = compose(_ModuleCard, { cieApi, appStore, settings });
const UpcomingSessions = compose(_UpcomingSessions,
  { cieApi, auth, appStore, ModuleCard })

const withAuth = createWithAuth(auth);

// authData={this.props.authData} {...rootProps} {...props}
const { authData } = appStore;
const _ClassroomInjected = compose(_Classroom, { appStore, authData, cieApi });

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
