import React, { Component } from 'react';
import './styles.css';
import { Router, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import history from '../history';
import Home from '../Home';
import Auth from '../auth/Auth';
import makeRequiresAuth from '../auth/RequiresAuth';
import Callback from '../auth/Auth0Callback';
import ClassroomContainer from '../aula/ClassroomContainer';
import Welcome from '../Welcome';
import Header from '../Header';


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
      authData: null,
      shrinkNav: false
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

  shrinkNav = () => {
    this.setState({
      shrinkNav: !this.state.shrinkNav
    });
  }

  render() {
    const { state: { authData } } = this;
    return (
      <Router history={history}>
        <div id="main-grid">
          <Header authData={authData} auth={auth} />
          <>
            <Route exact path="/" component={(props) => <Welcome auth={auth} authData={this.state.authData} {...props} />} />
            <Route exact path="/home" component={(props) => <Home auth={auth} authData={this.state.authData} {...props} />} />
            <Route exact path="/class" component={(props) => {
              return <ClassRoomProtected authData={this.state.authData} {...props} />;
            }} />
            }
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