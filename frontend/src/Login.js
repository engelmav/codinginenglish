import React, { Component } from 'react'
// import { Button } from '../UtilComponents/Button';


class Login extends Component {

  login = () => {
    this.props.auth.login(this.props.onLogin);
  }

  logout = () => {
    this.props.auth.logout();
  }

  componentDidUpdate(){
    console.log("Login component got isAuthenticated:", this.props.isAuthenticated);
  }

  render() {
    return (
      <>
        {
          !this.props.isAuthenticated &&
            <button onClick={this.login}>login</button>
        }
        {
          this.props.isAuthenticated &&
            <button onClick={this.logout}>
              log out
          </button>
        }
      </>
    );
  }
}

export default Login;