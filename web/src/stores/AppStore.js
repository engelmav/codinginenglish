import { action,computed, observable, toJS, flow } from 'mobx';
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
    const storedUser = (await cieApi.storeNewUser(authData)).data;
    console.log("storedUser:",storedUser);
    this.userId = storedUser.id;
    this.userSessions = storedUser.registered_modules;
  }
}


const appStore = new AppStore();
export { appStore };