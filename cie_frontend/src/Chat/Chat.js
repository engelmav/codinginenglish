import React, { Component } from 'react'
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: ""
    }
  }

  setCurrentMessage = (e) => {
    this.setState({currentMessage: e.target.value});
  }

  onEnterPress = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.currentMessage === ""){
        return;
      }
      this.setState({
        messages: this.state.messages.concat(this.state.currentMessage)
      });
      this.setState({currentMessage: ""});
    }
  }

  render() {
    const messages = this.state.messages;
    return (
      <div>
        <div id="message-container">
          {messages.map(
            (messageText, i) => 
              <Message key={i} 
                messageText={messageText} 
                userData={this.props.userData} />
            )
          }
        </div>
        <textarea 
          onKeyDown={this.onEnterPress} 
          onChange={this.setCurrentMessage}
          value={this.state.currentMessage}>
        </textarea>
      </div>
    )
  }
}


class Message extends Component {
  render() {
    return (
      <>
        <div className="message__user-message"><p>{`${this.props.userData.name}:  `}</p></div>
        <div><p>{this.props.messageText}</p> </div>
      </>
    )
  }
}

