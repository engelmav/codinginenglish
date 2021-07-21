import React, { Component } from 'react';
import axios from 'axios';


export default class Exercise002MenuFunctions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempLink: null,
      replBackend: null,
      content: null
    };
  }

  setInterimLink = (e) => this.setState({ tempLink: e.target.value })
  getContent = () => {
    this.setState({ replBackend: this.state.tempLink });
    console.log("Getting content from", this.state.tempLink)
    axios.get(this.state.tempLink)
      .then((res) => {
        console.log("Got content:", res.data);
        this.setState({ content: res.data });
      });
  }

  render() {
    return (
      <div>
        <label>Get your code results!</label>
        <input type="text" value={this.state.tempLink} onChange={this.setInterimLink}></input>
        <button onClick={this.getContent}>Set Link</button>
        {
          this.state.replBackend &&
          <div>{this.state.content}</div>
        }
      </div>
    );
  }
}

export { Exercise002MenuFunctions };