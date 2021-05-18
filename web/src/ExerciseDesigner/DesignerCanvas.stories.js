import React from "react";
import  { DesignCanvas as _DesignCanvas } from "./DesignCanvas";

export default {
  title: "Exercise Designer",
  component: DesignCanvas,
};

const settings = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
    websocketAddress: "ws://127.0.0.1:5000/ws/stream",
  },
};

class FakeWebsocket {
  send(data) {
    console.log(`fake websocket send() data:`, data);
  }
}
const websocket = new FakeWebsocket();



let props = {
  // model,
  // ...settings,
  // websocket,
  // appStore,
};

export const DesignCanvas = () => <_DesignCanvas {...props} />;
