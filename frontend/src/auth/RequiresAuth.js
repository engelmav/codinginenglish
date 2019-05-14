import React, { Component } from 'react';

// make a function that takes an auth instance
// and returns a RequiresAuth HOC

const makeRequiresAuth = (auth) => {
  return function (ProtectedRoute) {
    return class AuthHOC extends Component {
      componentWillMount(){
        if (!auth.isAuthenticated()){
          console.log("Not authenticated!");
          auth.navigateToHomeRoute();
        }
      }
      render(){
        return(
          <ProtectedRoute {...this.props} />
        );
      } 
    }
  }
}

export default makeRequiresAuth;
