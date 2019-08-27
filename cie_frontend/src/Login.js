import React, { Component } from 'react'

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
            <button onClick={this.logout} className="button">
              log out
          </button>
        }
      </>
    );
  }
}

export default Login;