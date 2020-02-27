import React, { Component } from 'react';
import MyDashboard from '../Home';
import { auth } from '../auth/Auth';
import makeRequiresAuth from '../auth/RequiresAuth';
import Callback from '../auth/Auth0Callback';
import ClassroomContainer from '../aula/ClassroomContainer';
import { Welcome } from '../Welcome';
import { withRouter, Route } from 'react-router-dom';
import VncDisplay from '../aula/VncDisplay';


var requiresAuth = makeRequiresAuth(auth);
const ClassRoomProtected = requiresAuth(ClassroomContainer);
const CallbackWithRouter = withRouter(Callback);

const handleAuthentication = ({ location }, cb) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication(cb);
  }
}

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount() {
    if (window.location.pathname.includes('/callback')) return;
    try {
      await auth.silentAuth(this.props.setIsAuthenticated);
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  render() {
    return (
      <>
        <Route exact path="/" component={(props) => <Welcome auth={auth} authData={this.props.authData} {...props} />} />
        <Route exact path="/my-dashboard" component={(props) => <MyDashboard auth={auth} authData={this.props.authData} {...props} />} />
        <Route exact path="/class" component={(props) =>
          <ClassRoomProtected authData={this.props.authData} {...props} />} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props, this.props.setIsAuthenticated);
          return <CallbackWithRouter {...props} />
        }} />
        <Route path="/vnc" component={() => <VncDisplay />} />
      </>
    );
  }
}

export default Routes;