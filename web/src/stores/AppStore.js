import { action, observable } from 'mobx';
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
    const newUser = await cieApi.storeNewUser(authData);
    this.userSessions = await cieApi.getUserRegistrations(newUser.id);
  }
}


const appStore = new AppStore();
export { appStore };