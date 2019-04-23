import React, { Component } from 'react'
import { GoogleLogin } from 'react-google-login';
import InstagramLogin from 'react-instagram-login'
import axios from 'axios';

let axiosConfig = {
  headers: {
      'Content-Type': 'application/json;charset=UTF-8',
  }
}

const responseInstagram = (response) => {
  console.log(response);
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false, user: null, token: ''
    }
  }

  logout = () => {
    this.setState({ isAuthenticated: false, token: '', user: null })
  }

  onFailure = (error) => {
    alert(error);
  }

  onGoogleSignIn = (response) => {
    // console.log(response);
    // const token = response.tokenId;
    const token = response.getAuthResponse().id_token;
    console.log("Got token:", token)
    axios.post('/auth/google', { token: token }, axiosConfig).then((res) => {
      console.log(res);
    })

  }


  test = () => { axios.post("/auth/google", { token: "made you look" }, axiosConfig); }

  render() {

    return (
      (!this.state.isAuthenticated) ?
        <div>
          <GoogleLogin
            clientId="528855637927-cresrrae893u9928cpdun6hidim9jagh.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.onGoogleSignIn}
            onFailure={this.onFailure}
            cookiePolicy={'single_host_origin'}
          />
          <InstagramLogin
            clientId="5fd2f11482844c5eba963747a5f34556"
            buttonText="Login"
            onSuccess={responseInstagram}
            onFailure={responseInstagram}
          />
          <button onClick={this.test}>test</button>
        </div>
        :
        <div>
          <p>Authenticated {this.state.user.email}></p>
          <button onClick={this.logout} className="button">
            Log out
                        </button>
        </div>
    );
  }
}
