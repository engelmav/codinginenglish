import React, { Component } from 'react'

class Login extends Component {
  constructor(props) {
    super(props);
    console.log("Constructed Login")
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
      <div>
        {
          !this.state.isAuthenticated &&
          <div>
            <button onClick={this.login}>auth0 login</button>
          </div>
        }
        {
          this.state.isAuthenticated &&
          <div>
            <p>Authenticated.</p>
            <button onClick={this.logout} className="button">
              Log out
          </button>
          </div>
        }
      </div>
    );
  }
}

export default Login;