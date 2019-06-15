import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div>
        Home
        {
          isAuthenticated() && (
              <h4>
                You are logged in!
              </h4>
            )
        }
      </div>
    )
  }
}
