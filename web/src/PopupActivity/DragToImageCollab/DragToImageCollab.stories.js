import React from "react";
import { DragToImageCollab as _DragToImageCollab } from "./DragToImageCollab";


export default {
  title: "PopUpActivities/DragToImageCollab",
  component: DragToImageCollab,
};

const settings = {
  settings: {
    assets: "https://cie-assets.nyc3.digitaloceanspaces.com",
    websocketAddress: "ws://127.0.0.1:5000/ws/stream"
  },
};

class FakeWebsocket {
  send(data){
    console.log(`fake websocket send() data:`, data);
  }
}
const websocket = new FakeWebsocket();

let props = {
  ...settings,
  websocket,
};

export const DragToImageCollab = () => <_DragToImageCollab {...props} />;
