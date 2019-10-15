import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import ChatView from './ChatView';
import RFB from '@novnc/novnc/core/rfb'
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    let userFirstName = null;
    if (this.props.authData !== null) {
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }
    return (
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={100}
        width={1200}
        isResizable={true}
        autoSize={true}
        draggableHandle={true}
      >
        <div key="a" data-grid={{ x: 0, y: 0, w: 5, h: 5 }} isResizable={true} draggableHandle={true}
          autoSize={true}>

          <Iframe
            url={`http://0.0.0.0:9999?userName=${userFirstName}`}
            width="100%"
            height="100%"
          />

        </div>
        <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2 }} isResizable={true}
          autoSize={true}>

          <Iframe
            id="slidesView"
            url="http://slides.com/vincentengelmann/interview-strategy/embed"
            width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />

        </div>
        <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }}>
          <ChatView authData={this.props.authData} />
        </div>
      </GridLayout>
    )
  }
}
