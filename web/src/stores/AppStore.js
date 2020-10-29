import { action,computed, observable } from 'mobx';
import { cieApi } from '../services/cieApi'


class AppStore {
  @observable isAuthenticated = false;
  @observable authData = null;
  @observable userId = null;
  @observable firstName = null;
  @observable email = null;
  @observable userSessions = null;

  @action toggleIsAuthenticated() {
    this.isAuthenticated = !this.isAuthenticated;
  }
  @action async storeUser(authData) {
    this.authData = authData;
    ({ given_name: this.firstName, email: this.email } = authData.idTokenPayload);
    console.log("auth data:", authData);
    const newUser = (await cieApi.storeNewUser(authData)).data;
    console.log("result of storeNewUser:", newUser);
    this.userSessions = newUser.registered_modules;
    console.log("appStore.storeUser() userSessions:", this.userSessions);
  }

  @computed get hasActiveSessions() {
    const now = new Date();
    console.log("appStore.hasActiveSessions() userSessions:", this.userSessions);
    if (this.userSessions) {
      this.userSessions.forEach(userSession => {
        if (userSession.start_time === now) {
          console.log("User has an active session!")
          return true;
        }
      });
    }
    console.log("No active sessions found."); 
    return false;
  }
}


const appStore = new AppStore();
export { appStore };