import React, { Component } from 'react'

export default class YoutubeEmbed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tempLink: null,
      youtubeLiveEmbed: null
    };
  }

  setInterimLink = (e) => this.setState({ tempLink: e.target.value })
  setLink = () => this.setState({ youtubeLiveEmbed: this.state.tempLink })
  
  render() {
    return (
      <div>
        <iframe title="_"
          width="560"
          height="315"
          src={this.state.youtubeLiveEmbed}
          frameborder="0"
          allowfullscreen
        >
        </iframe>
      </div>
    )
  }
}
