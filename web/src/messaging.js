import ReconnectingWebSocket from "reconnecting-websocket";

export class WebsocketManager {
  constructor(settings){
    this.settings = settings;
  }
  createWebsocket(channel, clientId = null) {
    const websocket = new ReconnectingWebSocket(this.settings.websocketAddress);
    websocket.onopen = function () {
      console.log("Created new websocket, subscribing to channel", channel, "with clientId", clientId);
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

