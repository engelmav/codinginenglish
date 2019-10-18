import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import ChatView from './ChatView';
import VncDisplay from './VncDisplay';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaGripLines } from 'react-icons/fa'


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
        <GridLayout
          className="layout"
          cols={12}
          rowHeight={100}
          width={2000}
          isResizable={true}
          autoSize={true}
          draggableHandle=".dragHandleClassName"
          containerPadding={[10, 10]}
        >
          <div key="a" data-grid={{ x: 0, y: 0, w: 4, h: 4 }} isResizable={true} draggableHandle={true}
            autoSize={true}
          >
            <DragHandle />
            <div style={{
              height: "calc(100% - 35px)",
              width: "calc(100% - 25px)"
            }}>
              <Iframe
                url={`https://localhost:5000?userName=${userFirstName}`}
                width="100%"
                height="100%"
              />
            </div>
          </div>
          <div key="b" data-grid={{ x: 1, y: 0, w: 4, h: 4 }} isResizable={true}
            autoSize={true}>
            <DragHandle />
            <div style={{
              height: "calc(100% - 35px)",
              width: "calc(100% - 25px)"
            }}>
              <Iframe
                id="slidesView"
                url="http://slides.com/vincentengelmann/001-devteamsloops/embed"
                width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
            </div>

          </div>
          <div key="c" data-grid={{ x: 0, y: 1, w: 4, h: 4 }}>
            <DragHandle />
            <div style={{
              height: "calc(100% - 35px)",
              width: "calc(100% - 25px)"
            }}>
              <ChatView authData={this.props.authData} />
            </div>
          </div>
        <div key="d" data-grid={{ x: 1, y: 1, w: 4, h: 4 }}>
            <DragHandle />
            <div style={{
              height: "calc(100% - 35px)",
              width: "calc(100% - 25px)"
            }}>
              <VncDisplay authData={this.props.authData} />
            </div>
          </div>
        </GridLayout>
      </>
    )
  }
}
