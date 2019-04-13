import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Exercise002MenuFunctions } from './exercises/exercise002MenuFunctions';
import { GoogleLogin } from 'react-google-login';


const responseGoogle = (response) => {
  console.log(response);
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempLink: null,
      youtubeLiveEmbed: null
    };
  }

  setInterimLink = (e) => this.setState({ tempLink: e.target.value })
  setLink = () => this.setState({ youtubeLiveEmbed: this.state.tempLink })
  //https://github.com/zoom/sample-app-web/blob/master/Local/js/index.js

  render() {

    return (
      <div className="">
        <GoogleLogin
          clientId="528855637927-cresrrae893u9928cpdun6hidim9jagh.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <label>Set Youtube Live:</label>
        <input type="text" value={this.state.tempLink} onChange={this.setInterimLink}></input>
        <button onClick={this.setLink}>Set Link</button>
        <iframe title="_" width="560" height="315" src={this.state.youtubeLiveEmbed} frameborder="0" allowfullscreen></iframe>

        <Exercise002MenuFunctions />

      </div>
    );
  }
}

export default App;
