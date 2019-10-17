import React, { Component } from 'react';
import RFB from '@novnc/novnc/core/rfb'


class VncTest extends Component {
  constructor(props) {
    super(props);
    this.vncRef = null;
    this.setVncRef = element => {
      this.vncRef = element;
    };
    this.attachToVncRef = () => {
      console.log("connecting to vnc")
      this.rfb = new RFB(this.vncRef, "ws://localhost:5990",
        { credentials: { password: 'ciecieci' } });
      console.log("connected:");
      console.log(this.rfb);
    };
  }

  componentDidMount(){
    this.attachToVncRef();
  }

  render() {
    return (
      <div ref={this.setVncRef}>

      </div>
    );
  }
}

export default VncTest;