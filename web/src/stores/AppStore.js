import { action, observable } from 'mobx';
import { storeNewUser, userRegistrations } from '../services/cieApi'


class AppStore {
  @observable isAuthenticated = false;
  @observable authData = null;
  @observable userId = null;
  @observable firstName = null;
  @observable userSessions = null;

  @action toggleIsAuthenticated() {
    this.isAuthenticated = !this.isAuthenticated;
  }
  @action storeUser(authData) {
    this.authData = authData;
    this.firstName = authData.idTokenPayload.given_name;
    storeNewUser(authData).then(res => {
      userRegistrations(res.data.id).then(res => {
        const userSessions = res.data;
        this.userSessions = userSessions;
      })
    });
  }
}


const appStore = new AppStore();
export { appStore };