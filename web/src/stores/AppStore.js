import { action, configure, makeAutoObservable } from "mobx";
import {
  clearPersist,
  isSynchronized,
  persistence,
  stopPersist,
  StorageAdapter,
} from "mobx-persist-store";

configure({
  enforceActions: "never",
});

class AppStore {
  isAuthenticated = false;
  authData = null;
  userId = null;
  firstName = null;
  email = null;
  registeredSessions = [];
  sessionInProgress = false;
  rocketchatAuthToken = null;

  constructor() {
    makeAutoObservable(this);
    this.setSessionInProgress = this.setSessionInProgress.bind(this);
    this.clearStore = this.clearStore.bind(this);
  }

  @action toggleIsAuthenticated() {
    this.isAuthenticated = !this.isAuthenticated;
  }

  @action async configureUser(authData, storedUser, rcAuthToken) {
    this.authData = authData;
    const { email, given_name } = authData.idTokenPayload;
    this.email = email;

    // TODO: perform official reconciliation of two user sources
    const { firstname } = storedUser;
    this.firstName = given_name || firstname;
    this.userId = storedUser.id;
    this.rocketchatAuthToken = rcAuthToken;
    this.setSessionInProgress(authData)
  }

  @action setFirstname(firstname) {
    this.firstName = firstname;
  }

  setSessionInProgress() {
    this.sessionInProgress = true;
  }
  clearStore() {
    clearPersist(this);
  }

  stopPersist() {
    stopPersist(this);
  }

  get isSynchronized() {
    return isSynchronized(this);
  }
}

export const makeAppStore = (appStoreName = "default") => {
  return persistence({
    name: `AppStore.${appStoreName}`,
    properties: [
      "isAuthenticated",
      "authData",
      "userId",
      "firstName",
      "email",
      "registeredSessions",
      "sessionInProgress",
      "rocketchatAuthToken",
    ],
    adapter: new StorageAdapter({
      read: async (name) => {
        const data = window.localStorage.getItem(name);
        return data ? JSON.parse(data) : undefined;
      },
      write: async (name, content) => {
        console.log(name, content);

        window.localStorage.setItem(name, JSON.stringify(content));
      },
    }),
    reactionOptions: {
      // optional
      delay: 200,
    },
  })(new AppStore());
};
