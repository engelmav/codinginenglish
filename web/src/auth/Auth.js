import auth0 from 'auth0-js';
import history from '../history'
import settings from '../settings';



var CLIENT_ID = 'pyJiq82f4s6ik5dr9oNnyryW5127T965';


class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: 'login.codinginenglish.com',
    clientID: CLIENT_ID,
    redirectUri: settings.auth0Host,
    responseType: 'token id_token',
    scope: 'openid email profile'
  });

  constructor(appStore) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.handleAuthenticationFromCallbackRoute = this.handleAuthenticationFromCallbackRoute.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.appStore = appStore;
    this.onAuthSuccess = [];
    this.onLogout = [];
  }


  addOnAuthSuccess(callback){
    this.onAuthSuccess.push(callback);
  }

  addOnLogout(callback) {
    this.onLogout.push(callback)
  }


  login() {
    console.log("Auth.js: calling auth0.authorize():");
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        resolve();
        this.setSession(authResult);
        console.log("Auth module successfully authenticated. Calling callbacks...")
        this.onAuthSuccess.forEach(callback => callback(authResult))
      });
    })
  }

  handleAuthenticationFromCallbackRoute = ({ location }) => {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.handleAuthentication();
    }
  }
  

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      returnTo: settings.auth0LogoutUrl,
      clientID: CLIENT_ID,
    });
    this.onLogout.forEach(cb => cb());
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }

  logout() {
    // Remove tokens and expiry time.
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    this.auth0.logout({
      returnTo: window.location.origin
    });
    this.onLogout.forEach(cb => cb());
  }

  isAuthenticated() {
    const isAuth = new Date().getTime() < this.expiresAt;
    return isAuth;
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(`Could not get new token (${err.error}: ${err.errorDescription})`)
      }
    });
  }

}

export { Auth };
