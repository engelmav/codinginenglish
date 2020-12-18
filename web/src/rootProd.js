import { Auth } from './auth/Auth'
import { StudentSessionManager } from './util'
import { AppStore } from './stores/AppStore'
import React from 'react';
import { Header as _Header } from './Header';
import makeRequiresAuth from './auth/RequiresAuth';


const CreateComponent = (Component, dependsToInject) => {
  return class InjectedHOC extends React.Component {
    render() {
      return (
        <Component {...dependsToInject} />
      );
    }
  }
}

const appStore = new AppStore();

const studentSessionMgr = new StudentSessionManager();
studentSessionMgr.onSessionStart(appStore.setSessionInProgress);

const auth = new Auth();
auth.addOnAuthSuccess(studentSessionMgr.start);

const Header = CreateComponent(_Header, { appStore, auth });

const requiresAuth = makeRequiresAuth(auth);


export {
  auth,
  appStore,
  Header,
  requiresAuth
};