class Event {
  constructor(name) {
    this.name = name;
    this.callbacks = [];
  }
  registerCallback(callback) {
    this.callbacks.push(callback);
  }
}

class Reactor {
  constructor() {
    this.events = {};
  }
  registerEvent(eventName) {
    var event = new Event(eventName);
    this.events[eventName] = event;
  }
  dispatchEvent(eventName, eventArgs) {
    console.log("Dispatching event", eventName, "with args", eventArgs)
    this.events[eventName].callbacks.forEach(function (callback) {
      callback(eventArgs);
    });
  }
  addEventListener(eventName, callback){
    this.events[eventName].registerCallback(callback);
  }
}

export default new Reactor();