import ReconnectingWebSocket from "reconnecting-websocket";

export class WebsocketManager {
  constructor(settings){
    this.settings = settings;
  }
  createWebsocket(channel) {
    const websocket = new ReconnectingWebSocket(this.settings.websocketAddress);
    websocket.onopen = function () {
      console.log("Created new websocket, subscribing to channel", channel);
      websocket.send(
        JSON.stringify({
          command: "subscribe",
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

