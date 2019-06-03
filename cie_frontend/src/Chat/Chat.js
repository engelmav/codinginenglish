import React, { Component } from 'react'
import './Chat.css';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: ["Hello!!!"],
      currentMessage: ""
    }
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }

  setCurrentMessage = (e) => {
    this.setState({ currentMessage: e.target.value });
  }

  onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (this.state.currentMessage === "") {
        return;
      }
      this.setState({
        messages: this.state.messages.concat(this.state.currentMessage)
      });
      this.setState({ currentMessage: "" });
    }
  }

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    const messages = this.state.messages;
    return (
      <div id="messages-and-input">
        <div
          id="message-container"
          ref={(div) => {
            this.messageList = div;
          }}
        >
          {messages.map(
            (messageText, i) =>
              <Message key={i}
                messageText={messageText}
                userData={this.props.userData} />
          )
          }
        </div>
        <textarea
          id="chat__input"
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
        <div className="message__row message__user-message">
          <p>{`${this.props.userData.name}:  `}</p>
        </div>
        <div className="message__row"><p>{this.props.messageText}</p> </div>
      </>
    )
  }
}

