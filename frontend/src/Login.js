import React, { Component } from 'react'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  login = () => {
    this.props.auth.login();
  }

  logout = () => {
    this.props.auth.logout();
  }

  componentDidMount() {
    console.log("Running Login.componentDidMount()")
    const { isAuthenticated, renewSession } = this.props.auth;
    this.setState({ isAuthenticated: isAuthenticated() });

  }
  render() {
    return (
      <>
        {
          !this.state.isAuthenticated &&
          <>
            <button onClick={this.login}>auth0 login</button>
          </>
        }
        {
          this.state.isAuthenticated &&
          <>
            <p>Authenticated.</p>
            <button onClick={this.logout} className="button">
              Log out
          </button>
          </>
        }
      </>
    );
  }
}
