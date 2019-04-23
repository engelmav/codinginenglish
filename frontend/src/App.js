import React, { Component } from 'react';
import './App.css';
import { Exercise002MenuFunctions } from './exercises/exercise002MenuFunctions';
import { Routes } from './routes';




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
        <Routes />
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
