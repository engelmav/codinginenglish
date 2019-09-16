import React, { Component } from 'react';
import Iframe from 'react-iframe';
import axios from 'axios';


class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rocketChatAuthToken: null
    };
  }

  componentDidMount() {
    // SSO a la auth0 and custom RocketChat param.
    const { authData } = this.props;
    axios.post('/rocketchat/login', { authData })
      .then(res => {
        const { rocketchatAuthToken } = res.data;
        console.log('ChatView got authToken', rocketchatAuthToken);
        this.setState({ rocketchatAuthToken: rocketchatAuthToken });
      });
  }
  render() {
    const { rocketchatAuthToken } = this.state;
    return (
      <>
        {rocketchatAuthToken && <Iframe
          url={`http://localhost:3000/channel/general?layout=embedded&authToken=${rocketchatAuthToken}`}
          id="classroomcontainer__chat-iframe"
          width="100%" height="100%"
        />}
      </>
    );
  }
}

export default ChatView;