import React, { Component } from 'react';



export default class StudentView extends Component {
  render() {
    return (
      <div>
        Student
        <GoogleLogin
          clientId="528855637927-cresrrae893u9928cpdun6hidim9jagh.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <InstagramLogin
          clientId="5fd2f11482844c5eba963747a5f34556"
          buttonText="Login"
          onSuccess={responseInstagram}
          onFailure={responseInstagram}
        />
      </div>
    )
  }
}
