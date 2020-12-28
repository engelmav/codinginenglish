import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { observer } from 'mobx-react';


@observer
class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      auth,

      CallbackRoute,
      Classroom,
      Home,
      MyDashboard,
      UpcomingSessions,
    } = this.props;

    return (
      <>
        <Route exact path="/" component={(props) => <Home />} />
        <Route exact path="/upcoming-sessions" component={(props) => <UpcomingSessions />} />
        <Route exact path="/my-dashboard" component={(props) => <MyDashboard />} />
        <Route exact path="/class" component={(props) => <Classroom />} />
        <Route path="/callback" render={(props) => {
          auth.handleAuthenticationFromCallbackRoute(props);
          return <CallbackRoute {...props} />
        }} />
        <Route path="/login" render={(props) => {
          auth.login();
        }} />
      </>
    );
  }
}


export { Routes };