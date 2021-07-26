import { action, configure, makeAutoObservable }  from "mobx";
import {
  clearPersist,
  isSynchronized,
  rehydrate,
  persistence,
  stopPersist,
  StorageAdapter,
} from "mobx-persist-store";

export const makeAppStore = (appStoreName = "default") => {
  configure({
    enforceActions: "never",
  });

  class AppStore {
    activeSessionId = null;
    activeSessionSlug = null;
    applicationOpen = true;
    isAuthenticated = false;
    loginExpiresAt = null;
    authData = null;
    userId = null;
    userRole = null;
    userLocation = null;
    flow = null;
    firstName = null;
    lastName = null;
    email = null;
    registeredSessions = [];
    sessionInProgress = false;
    rocketchatAuthToken = null;
    userApplied = false;

    constructor() {
      makeAutoObservable(this);
      this.setSessionInProgress = this.setSessionInProgress.bind(this);
      this.clearStore = this.clearStore.bind(this);
    }

    @action toggleIsAuthenticated() {
      this.isAuthenticated = !this.isAuthenticated;
    }

    @action setLoginExpiry(expiresAt) {
      this.loginExpiresAt = expiresAt;
    }

    @action async configureUser(authData, storedUser, rcAuthToken) {
      this.authData = authData;
      const { email, given_name } = authData.idTokenPayload;
      this.email = email;

      // TODO: perform official reconciliation of two user sources
      const { firstname, lastname, id, role } = storedUser;
      this.firstName = firstname;
      this.lastName = lastname;
      this.userId = id;
      console.log("stored user object:", storedUser);
      this.userRole = role;

      this.rocketchatAuthToken = rcAuthToken;
    }

    @action setFirstname(firstname) {
      this.firstName = firstname;
    }

    @action setUserRole(role) {
      this.userRole = role;
    }

    setSessionInProgress(isInProgress) {
      this.sessionInProgress = isInProgress;
    }
    clearStore() {
      clearPersist(this);
    }

    stopPersist() {
      stopPersist(this);
    }

    async rehydrate() {
      return await rehydrate(this);
    }

    get isSynchronized() {
      console.log("running isSynchronized()");
      return isSynchronized(this);
    }
  }

  return persistence({
    name: `AppStore.${appStoreName}`,
    properties: [
      "activeSessionId",
      "isAuthenticated",
      "loginExpiresAt",
      "authData",
      "userId",
      "userRole",
      "firstName",
      "flow",
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
