import auth0 from 'auth0-js';
import history from '../history'


var CLIENT_ID = 'pyJiq82f4s6ik5dr9oNnyryW5127T965';
class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: 'dev-nougy3g5.auth0.com',
    clientID: CLIENT_ID,
    redirectUri: 'http://192.168.1.43/callback',
    responseType: 'token id_token',
    scope: 'openid email profile'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }


  login(cb) {
    this.auth0.authorize();
  }

  handleAuthentication(cb) {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult, cb);;
        this.navigateToHomeRoute();
        resolve();
      });
    })
  }

  setSession(authResult, cb) {
    cb(authResult);
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      returnTo: 'http://localhost:8080',
      clientID: CLIENT_ID,
    });
  }

  silentAuth(cb) {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult, cb);
        resolve();
      });
    });
  }

  navigateToHomeRoute() {
    history.push('/home');
  }

  logout() {
    // Remove tokens and expiry time.
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // could this be redundant?
    this.navigateToHomeRoute();
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

var auth = new Auth();

export { auth };
