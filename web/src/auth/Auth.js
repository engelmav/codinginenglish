import settings from "../settings";
import auth0 from "auth0-js";
var CLIENT_ID = "pyJiq82f4s6ik5dr9oNnyryW5127T965";

class Auth {
  accessToken;
  idToken;

  auth0 = new auth0.WebAuth({
    domain: "login.codinginenglish.com",
    clientID: CLIENT_ID,
    redirectUri: settings.auth0Host,
    responseType: "token id_token",
    scope: "openid email profile",
  });

  constructor(appStore) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.handleAuthenticationFromCallbackRoute =
      this.handleAuthenticationFromCallbackRoute.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.appStore = appStore;
    this.onAuthSuccess = [];
    this.onLogout = [];
  }

  addOnAuthSuccess(callback) {
    this.onAuthSuccess.push(callback);
  }

  addOnLogout(callback) {
    this.onLogout.push(callback);
  }

  login(options = null) {
    if (options) {
      return this.auth0.authorize(options);
    }
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (err || !authResult || !authResult.idToken) {
          console.log("There was an issue attempting to login.");
        }
        this.setSession(authResult);
        this.onAuthSuccess.forEach((callback) => callback(authResult));
        resolve();
      });
    });
  }

  handleAuthenticationFromCallbackRoute = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.handleAuthentication();
    }
  };

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.appStore.setLoginExpiry(authResult.idTokenPayload.exp * 1000);
    console.log("set login expiry:", this.appStore.loginExpiresAt);
  }

  signOut() {
    this.onLogout.forEach((cb) => cb());
    this.auth0.logout({
      returnTo: settings.auth0LogoutUrl,
      clientID: CLIENT_ID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        console.log("silentAuth() setSession");
        this.setSession(authResult);
        resolve();
      });
    });
  }

  logout() {
    this.onLogout.forEach((cb) => cb());
    // Remove tokens and expiry time.
    this.accessToken = null;
    this.idToken = null;
    this.appStore.setLoginExpiry(0);

    this.auth0.logout({
      returnTo: window.location.origin,
    });
  }

  isAuthenticated() {
    const currentTime = new Date().getTime();
    console.log(
      "isAuthenticated() sees loginExpiresAt:",
      this.appStore.loginExpiresAt
    );
    const isAuth = currentTime < this.appStore.loginExpiresAt;
    return isAuth;
  }

  renewSession() {
    console.log("renewing session");
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get new token (${err.error}: ${err.errorDescription})`
        );
      }
    });
  }
  loginWithGoogle(cb = null) {
    this.auth0.authorize(
      {
        connection: "google-oauth2",
      },
      (err, res) => {
        if (cb) cb(err, res);
      }
    );
  }
  loginWithEmailLink(email, cb = null) {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessStart(
        {
          email,
          send: "link",
          connection: "email",
        },
        (err, res) => {
          if (cb) cb(err, res);
          if (err) {
            console.log("error ocurred in passwordless login:", err);
          }
          if (res) {
            console.log("successful passwordlessStart:", res);
            resolve(res);
          }
        }
      );
    });
  }
}

export default Auth;