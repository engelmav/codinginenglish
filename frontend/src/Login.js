import React, { Component } from 'react'
import Auth from './auth/Auth';


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    }
  }

  componentWillMount() {
    this.setState(
      { isAuthenticated: this.props.auth.isAuthenticated() },
      () => console.log("isAuthenticated set to", this.state.isAuthenticated)
    );
  }

  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }

  render() {

    return (
      (!this.state.isAuthenticated) ?
        <div>
          <button onClick={this.login}>auth0 login</button>
        </div>
        :
        <div>
          <p>Authenticated.</p>
          <button onClick={this.logout} className="button">
            Log out
          </button>
        </div>
    );
  }
}
