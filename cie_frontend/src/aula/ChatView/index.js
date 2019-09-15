import React, { Component } from 'react';
import Iframe from 'react-iframe';
import axios from 'axios';


class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rocketChatLoggedIn: false
    };
  }

  componentDidMount() {
    axios.post('/login')
  }
  render() {
    return (
      <>
        {<Iframe
          // url="https://codinginenglish.rocket.chat/channel/general?layout=embedded"
          url="http://localhost:3000/channel/general?layout=embedded"
          id="classroomcontainer__chat-iframe"
          width="100%" height="100%"
        />}
      </>
    );
  }
}

export default ChatView;