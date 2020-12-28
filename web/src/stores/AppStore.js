import { action,computed, observable, toJS, flow } from 'mobx';
import { cieApi } from '../services/cieApi'


class AppStore {
  @observable isAuthenticated = false;
  @observable authData = null;
  @observable userId = null;
  @observable firstName = null;
  @observable email = null;
  @observable registeredSessions = null;
  @observable sessionInProgress = false;

  constructor(){
    this.setSessionInProgress = this.setSessionInProgress.bind(this);
  }

  @action toggleIsAuthenticated() {
    this.isAuthenticated = !this.isAuthenticated;
  }
  
  @action async configureUser(authData, storedUser) {
    console.log("configureUser()", authData, storedUser);
    this.authData = authData;
    ({ given_name: this.firstName, email: this.email } = authData.idTokenPayload);
    this.userId = storedUser.id;
  }

  setSessionInProgress(){
    console.log("AppStore setting sessionInProgress to `true`");
    this.sessionInProgress = true;
  }
}


export { AppStore };