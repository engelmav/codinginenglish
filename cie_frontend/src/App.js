import React, { Component } from 'react';
import './App.css';
import { Router, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import history from './history';
import Login from './Login';
import Home from './Home';
import Auth from './auth/Auth';
import makeRequiresAuth from './auth/RequiresAuth';
import Callback from './auth/Auth0Callback';
import ClassroomContainer from './aula/ClassroomContainer';


var auth = new Auth();
const handleAuthentication = ({ location }, cb) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication(cb);
  }
}

var requiresAuth = makeRequiresAuth(auth);
const ClassRoomProtected = requiresAuth(ClassroomContainer);
const CallbackWithRouter = withRouter(Callback);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      authData: null
    };
  }

  async componentDidMount() {
    if (window.location.pathname.includes('/callback')) return;
    try {
      await auth.silentAuth(this.setIsAuthenticated);
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  setIsAuthenticated = (authData) => {
    console.log("authData from setIsAuthenticated:", authData);
    this.setState(
      {
        isAuthenticated: true,
        authData
      }
    );
  }

  render() {
    return (
      <Router history={history}>
        <div id="main-grid">
          <ul id="routes__navbar">
            <li><Link to="/home">Home</Link></li>
            {auth.isAuthenticated() &&
              <li>
                <Link to="/class">Class</Link>
              </li>
            }
            <li><Login auth={auth} isAuthenticated={auth.isAuthenticated()} /></li>
          </ul>
          <>
            <Route exact path="/home" component={(props) => <Home auth={auth} authData={this.state.authData} {...props} />} />
            <Route exact path="/class" component={(props) => <ClassRoomProtected authData={this.state.authData} {...props} />} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props, this.setIsAuthenticated);
              return <CallbackWithRouter {...props} />
            }} />
          </>
        </div>
      </Router>
    );
  }
}

export default App;