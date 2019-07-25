import React, { Component } from 'react'

export default class Home extends Component {
  // this.state.authData
  render() {
    const { isAuthenticated } = this.props.auth;
    let userFirstName = null;
    if (this.props.authData !== null){
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }
    return (
      <div>
        Home
        {
          isAuthenticated() && (
              <h4>
                Welcome, {userFirstName}!
              </h4>
            )
        }
      </div>
    )
  }
}
