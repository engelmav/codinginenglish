import React from "react";
import { DragToImageCollab as _DragToImageCollab } from "./DragToImageCollab";
import { makeAppStore } from "../../stores/AppStore";

export default {
  title: "PopUpActivities/DragToImageCollab",
  component: DragToImageCollab,
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
const model = {
  images: [
    {
      imageSource: "/activities/dragToImage/basic-01-horse.gif",
      pos: { x: 3, y: 49 },
    },
  ],
  wordBag: [
    'The frontend is where users give and receive input. It\'s the "Eyes and Ears" of the application.',
    "The backend interacts with the database.",
    'Everything runs on Linux. Linux is the "ground" of the application.',
    "The database is where all the memories are stored. It helps the application remeber all the customer orders, or the menu!",
  ],
  labelBuckets: [
    { lineBegin: [339, 241], lineEnd: [317, 138] },
    { lineBegin: [342, 253], lineEnd: [400, 248] },
    { lineBegin: [291, 338], lineEnd: [299, 400] },
    { lineBegin: [273, 260], lineEnd: [131, 64] },
  ],
};

const appStore = makeAppStore();
appStore.userId = 1;

let props = {
  model,
  ...settings,
  websocket,
  appStore
};

export const DragToImageCollab = () => <_DragToImageCollab {...props} />;
