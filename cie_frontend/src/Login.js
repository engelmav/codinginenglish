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
      <div>
        {
          !this.props.isAuthenticated &&
          <div>
            <button onClick={this.login}>login</button>
          </div>
        }
        {
          this.props.isAuthenticated &&
          <div>
            <button onClick={this.logout} className="button">
              log out
          </button>
          </div>
        }
      </div>
    );
  }
}

export default Login;