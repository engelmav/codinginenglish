import ReconnectingWebSocket from "reconnecting-websocket";

export class WebsocketManager {
  constructor(settings) {
    this.settings = settings;
  }
  createWebsocket(channel, clientId = null) {
    const websocket = new ReconnectingWebSocket(this.settings.websocketAddress);
    websocket.onopen = function () {
      console.log(
        "Created new websocket, subscribing to channel",
        channel,
        "with clientId",
        clientId
      );
      websocket.send(
        JSON.stringify({
          command: "subscribe",
          clientId: clientId,
          identifier: { channel: channel },
        })
      );
    };
    return websocket;
  }
  subscribeToChannel(websocket, channelName, clientId = null) {
    console.log("Subscribing to websocket channel", channelName);
    websocket.send(
      JSON.stringify({
        command: "subscribe",
        clientId,
        identifier: { channel: channelName },
      })
    );
  }
}

export function readSocketDataAnd(doSomething, event) {
  const { data } = event;
  if (data instanceof Blob) {
    const reader = new FileReader();
    reader.onload = () => {
      let eventData;
      try {
        eventData = JSON.parse(reader.result);
        console.log(eventData);
        doSomething(eventData);
      } catch (ex) {
        console.error("Failed to parse websocket event data.", ex.stack);
        console.log(reader.result);
        return;
      }
    };
    reader.readAsText(data);
  }
}

class ReadAndDo {
  constructor(cb) {
    this.cb = cb;
  }
  read = (event) => {
    const { data } = event;
    if (data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        let eventData;
        try {
          eventData = JSON.parse(reader.result);
          console.log(eventData);
          this.cb(eventData);
        } catch (ex) {
          console.error("Failed to parse websocket event data.", ex.stack);
          console.log(reader.result);
          return;
        }
      };
      reader.readAsText(data);
    }
  };
}

export { ReadAndDo };
