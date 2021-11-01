import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Technique } from "../Technique/Technique";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (window.location.pathname.includes("/callback")) return;
    try {
      await this.props.auth.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== "login_required") console.log(err.error);
    }
  }

  render() {
    const {
      authLazy,
      appStore,
      AboutUs,
      CallbackRoute,
      CollabEditor,
      MyDashboard,
      UpcomingSessions,
      ApplicationProcess,
    } = this.props;
    return (
      <>
        <Route exact path="/about-us" component={(props) => <AboutUs />} />
        <Route
          exact
          path="/upcoming-sessions"
          component={(props) => <UpcomingSessions />}
        />
        <Route
          exact
          path="/my-dashboard"
          component={(props) => <MyDashboard />}
        />
        <Route exact path="/technique" component={() => <Technique />} />
        <Route
          path="/callback"
          render={(props) => {
            return <CallbackRoute {...props} authLazy={authLazy} />;
          }}
        />
        <Route
          path="/login"
          render={(props) => {
            auth.login();
          }}
          exact
        />
        <Route exact path="/editor" component={(props) => <CollabEditor />} />

        <Route
          path="/apply"
          component={(props) => {
            console.log("hit /apply route");
            return <ApplicationProcess />;
          }}
        />
      </>
    );
  }
}

export { Routes };
