import { action, computed, observable } from 'mobx';
import {
  persistence,
  useClear,
  useDisposers,
  isSynchronized,
  StorageAdapter
} from 'mobx-persist-store';


function readStore(name) {
  return new Promise((resolve) => {
    const data = sessionStorage.getItem(name);
    const objects = JSON.parse(data)
    console.log("readStore objects:")
    console.log(objects)
    resolve(objects);
  });
}

function writeStore(name, content) {
  return new Promise((resolve) => {
    sessionStorage.setItem(name, JSON.stringify(content));
    resolve()
  });
}

class AppStore {
  @observable isAuthenticated = false;
  @observable authData = null;
  @observable userId = null;
  @observable firstName = null;
  @observable email = null;
  @observable registeredSessions = [];
  @observable sessionInProgress = false;

  constructor() {
    this.setSessionInProgress = this.setSessionInProgress.bind(this);
    this.resetStore = this.resetStore.bind(this);
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

  setSessionInProgress() {
    this.sessionInProgress = true;
  }

  @action resetStore = () => {
    useClear(this)
  }

  @action persistDispose = () => {
    useDisposers(this)
  }

  @computed get isSynchronized() {
    return isSynchronized(this)
  }
}

persistence({
  name: 'AppStore',
  properties: ['isAuthenticated', 'authData', 'userId', 'firstName', 'email', 'registeredSessions', 'sessionInProgress'],
  adapter: new StorageAdapter({
    read: readStore,
    write: writeStore
  }),
  reactionOptions: {
    delay: 2000
  }
})(AppStore);

export { AppStore };