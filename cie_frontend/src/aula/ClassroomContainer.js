import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import ChatView from './ChatView';
import VncDisplay from './VncDisplay';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaGripLines } from 'react-icons/fa'
import { Rnd } from 'react-rnd';


export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    let userFirstName = null;
    if (this.props.authData !== null) {
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }

    const DragHandle = () =>
      <div className="dragHandleClassName">
        <span className="text">
          <FaGripLines />
        </span>
      </div>;

    return (
      <>
        <div style={{border: "1px solid black"}}>test thing</div>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div style={{background: "white"}}><FaGripLines />Slides</div>
          <Iframe
            id="slidesView"
            url="http://slides.com/vincentengelmann/001-devteamsloops/embed"
            width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </Rnd>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div><FaGripLines />Chat</div>
          <ChatView authData={this.props.authData} />
        </Rnd>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div><FaGripLines />Video</div>
          <Iframe
            url={`https://localhost:5000?userName=${userFirstName}`}
            width="100%"
            height="100%"
          />
        </Rnd>
        <Rnd
          default={{
            x: 605,
            y: 0,
            width: 800,
            height: 600
          }}
        >
          <div><FaGripLines />Dev</div>
          <VncDisplay authData={this.props.authData} />
        </Rnd>
      </>
    )
  }
}
