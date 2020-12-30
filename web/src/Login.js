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
    const { appStore } = this.props;
    return (
      <>
        {
          appStore.authData === null &&
            <Button onClick={this.login}>sign in / sign up</Button>
        }
        {
          appStore.authData !== null &&
            <Button onClick={this.logout}>
              sign out
          </Button>
        }
      </>
    );
  }
}

export default Login;