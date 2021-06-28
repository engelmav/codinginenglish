

event_emitter = EventEmitter()


def emit_event(event):
    action = event.get("action")
    event_emitter.emit(action, event)


def wire_events():
