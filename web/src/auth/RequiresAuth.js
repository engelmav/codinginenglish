import React, { Component } from 'react';
import history from '../history';

// make a function that takes an auth instance
// and returns a RequiresAuth HOC

const createWithAuth = (auth) => {
  return function (ProtectedRoute) {
    return class AuthHOC extends Component {
      componentWillMount() {
        if (!auth.isAuthenticated()) {
          console.log("Not authenticated!");
          history.push('/');
        }
      }
      render() {
        return (
          <ProtectedRoute {...this.props} />
        );
      }
    }
  }
}

export { createWithAuth };
