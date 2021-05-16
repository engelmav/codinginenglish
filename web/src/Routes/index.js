import React, { Component } from "react";
import { Route } from "react-router-dom";
import { observer } from "mobx-react";
import { Technique } from "../Technique/Technique";
import Designer from "../ExerciseDesigner";

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

      AboutUs,
      CallbackRoute,
      Classroom,
      Home,
      MyDashboard,
      UpcomingSessions,
    } = this.props;

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
        />
        <Route
          exact
          path="/designer"
          component={(props) => <Designer />}
        />
      </>
    );
  }
}

export { Routes };
