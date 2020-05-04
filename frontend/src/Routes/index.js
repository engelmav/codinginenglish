import React, { Component } from 'react';
import MyDashboard from '../Home';
import { auth } from '../auth/Auth';
import makeRequiresAuth from '../auth/RequiresAuth';
import Callback from '../auth/Auth0Callback';
import ClassroomContainer from '../aula/ClassroomContainer';
import { Welcome } from '../Welcome';
import { withRouter, Route } from 'react-router-dom';
import { appStore } from '../stores/AppStore';
import { observer } from 'mobx-react';


var requiresAuth = makeRequiresAuth(auth);
const ClassroomProtected = requiresAuth(ClassroomContainer);
const CallbackWithRouter = withRouter(Callback);

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}


@observer
class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount() {
    if (window.location.pathname.includes('/callback')) return;
    try {
      await auth.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  render() {
    return (
      <>
        <Route exact path="/" component={(props) => <Welcome {...props} />} />
        <Route exact path="/my-dashboard" component={(props) => <MyDashboard auth={auth} appStore={appStore} {...props} />} />
        <Route exact path="/class" component={(props) =>
          <ClassroomProtected authData={this.props.authData} appStore={appStore} {...props} />} />
        <Route path="/callback" render={(props) => {
          handleAuthentication(props);
          return <CallbackWithRouter {...props} />
        }} />
      </>
    );
  }
}


export default Routes;