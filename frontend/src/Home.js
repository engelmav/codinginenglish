import React, { Component } from 'react'
import { userRegistrations } from './services/cieApi';

export default class MyDashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      userRegistrations: userRegistrations(props.userId)
    }
  }
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
        <p>Your class is in session. Go there now!</p>
        <p>Your next classes</p>
        <p>Find More Classes</p>
        <p>Words for me to learn</p>
      </div>
    )
  }
}
