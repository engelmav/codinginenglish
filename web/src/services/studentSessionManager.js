class StudentSessionManager {
  constructor(websocket) {
    this.websocket = websocket;
    this.start = this.initialize.bind(this);
    this.onSessionStartCallbacks = [];
  }

  addOnSessionStart(callback) {
    this.onSessionStartCallbacks.push(callback);
  }
  onSessionStart(event) {
    this.onSessionStartCallbacks.forEach((cb) => cb(event));
  }
  onSessionEnd(callback) {
    this.onSessionEndCallback = callback;
  }

  delegateEvent(data) {
    try {
      const eventData = JSON.parse(data);
      console.log("Event data:", eventData);
      const isStartEvent =
        eventData.hasOwnProperty("event_type") &&
        eventData.event_type === "session_start";
      if (isStartEvent) {
        console.log("Received sessionStart event");
        this.onSessionStart(eventData);
      }
    } catch (ex) {
      console.log("student-session-manager unable to parse event data:", data);
      throw ex;
    }
  }

  initialize() {
    console.log("websocket object:", this.websocket);
    this.websocket.addEventListener("message", (event) => {
      const { data } = event;
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          this.delegateEvent(reader.result);
        };
        reader.readAsText(data);
      }
    });
  }
}

export default StudentSessionManager;