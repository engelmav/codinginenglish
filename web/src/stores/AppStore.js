import { action,computed, makeObservable, observable } from 'mobx';
import { cieApi } from '../services/cieApi'


class AppStore {
  @observable isAuthenticated = false;
  @observable authData = null;
  @observable userId = null;
  @observable firstName = null;
  @observable email = null;
  @observable userSessions = null;
  /**
   * Notes for tomorrow:
   *  - upgrade mobx to get makeObservable.
   *  - fix hasActiveSessions to work with Login component
   */
  constructor() {
    makeObservable(this, {
      isAuthenticated: computed
    })
  }

  @action toggleIsAuthenticated() {
    this.isAuthenticated = !this.isAuthenticated;
  }
  @action async storeUser(authData) {
    this.authData = authData;
    ({ given_name: this.firstName, email: this.email } = authData.idTokenPayload);
    console.log("auth data:", authData);
    const newUser = (await cieApi.storeNewUser(authData)).data;
    console.log("result of storeNewUser:", newUser);
    this.userSessions = await cieApi.getUserRegistrations(newUser.id);
  }

  mGet hasActiveSessions() {
    const now = new Date();
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