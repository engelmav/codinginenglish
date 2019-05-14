import auth0 from 'auth0-js';
import history from '../history'


export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'dev-nougy3g5.auth0.com',
    clientID: 'pyJiq82f4s6ik5dr9oNnyryW5127T965',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.navigateToHomeRoute();
        console.log(err);
      }
    });
  }

  navigateToHomeRoute() {
    history.push('/home');
  }

  setSession(authResult) {
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the Access Token will expire.
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    this.navigateToHomeRoute();
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
    return new Date().getTime() < this.expiresAt;
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