import React, { Component } from 'react';
import MyDashboard from '../MyDashboard';
import { cieApi } from '../services/cieApi';
import Callback from '../auth/Auth0Callback';
import Aula from '../Aula';
import { Home } from '../Home';
import { Classes } from '../Classes';
import { withRouter, Route } from 'react-router-dom';
import { observer } from 'mobx-react';
import { requiresAuth } from '../rootProd';


const ClassroomProtected = requiresAuth(Aula);
const CallbackWithRouter = withRouter(Callback);

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
      await this.props.auth.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  render() {

    const {
      appStore,
      auth
    } = this.props;

    const rootProps = {
      appStore,
      auth,
      cieApi
    }

    return (
      <>
        <Route exact path="/" component={(props) => <Home {...rootProps} {...props} />} />
        <Route exact path="/classes" component={(props) => <Classes {...rootProps} />} />
        <Route exact path="/my-dashboard" component={(props) => <MyDashboard {...rootProps} {...props} />} />
        <Route exact path="/class" component={(props) =>
          <ClassroomProtected authData={this.props.authData} {...rootProps} {...props} />} />
        <Route path="/callback" render={(props) => {
          auth.handleAuthenticationFromCallbackRoute(props);
          return <CallbackWithRouter {...props} />
        }} />
        <Route path="/login" render={(props) => {
          auth.login();
        }} />
      </>
    );
  }
}


export default Routes;