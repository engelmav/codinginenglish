import React, { Component } from 'react'
import { Button } from './UtilComponents/Button';


class Login extends Component {

  login = () => {
    this.props.auth.login(this.props.onLogin);
  }

  logout = () => {
    this.props.auth.logout();
  }

  render() {
    return (
      <>
        {
          !this.props.isAuthenticated &&
            <Button onClick={this.login}>sign in / sign up</Button>
        }
        {
          this.props.isAuthenticated &&
            <Button onClick={this.logout}>
              sign out
          </Button>
        }
      </>
    );
  }
}

export default Login;