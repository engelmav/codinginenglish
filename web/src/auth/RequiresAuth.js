import React, { Component } from "react";
import Router from "next/router";

// make a function that takes an auth instance
// and returns a RequiresAuth HOC

const createWithAuth = (authLazy) => {
  return function (ProtectedRoute) {
    return class AuthHOC extends Component {
      async componentWillMount() {
        const auth = await authLazy();
        if (!(await auth.isAuthenticated())) {
          console.log("Not authenticated!");
          Router.push("/");
        }
      }
      render() {
        return <ProtectedRoute {...this.props} />;
      }
    };
  };
};

export { createWithAuth };
