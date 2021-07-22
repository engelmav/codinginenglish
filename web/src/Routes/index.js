import React, { Component } from "react";
import { Route } from "react-router-dom";
import { observer } from "mobx-react";
import { Technique } from "../Technique/Technique";

@observer
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
      auth,
      appStore,
      AboutUs,
      CallbackRoute,
      Classroom,
      CollabEditor,
      Home,
      MyDashboard,
      UpcomingSessions,
      ApplicationProcess,
    } = this.props;
    console.log(
      "this what we have for ApplicationProcess:",
      ApplicationProcess
    );
    console.log("this what we have for Home:", Home);
    return (
      <>
        <Route exact path="/" component={(props) => <Home />} />
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
        <Route exact path="/class" component={(props) => <Classroom />} />
        <Route exact path="/technique" component={() => <Technique />} />
        <Route
          path="/callback"
          render={(props) => {
            auth.handleAuthenticationFromCallbackRoute(props);
            return <CallbackRoute {...props} />;
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
