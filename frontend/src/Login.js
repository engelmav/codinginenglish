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
            <Button onClick={this.login}>login</Button>
        }
        {
          this.props.isAuthenticated &&
            <Button onClick={this.logout}>
              log out
          </Button>
        }
      </>
    );
  }
}

export default Login;