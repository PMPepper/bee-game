export class EventDispatcher {
  constructor() {
    this.__events = {};
  }

  addListener(eventType, handler) {
    const events = this.__events;

    if(!events.hasOwnProperty(eventType)) {
      events[eventType] = [];
    }

    const listener = new EventListener(eventType, handler, this);

    events[eventType].push(listener);
  }

  removeListener(listener) {
    if(!listener || listener._dispatcher != this) {
      return false;
    }

    const listeners = this.__events[listener.type];

    if(!listeners || listeners.length == 0) {
      return false;
    }

    for(let i = 0; i < listeners.length; i++) {
      if(listeners[i] == listener) {
        listeners.splice(i, -1);

        return true;
      }
    }

    return false;
  }

  dispatchEvent(event) {
    const eventType = event.type;
    const listeners = this.__events[eventType];

    if(!listeners) {
      return;
    }

    event = Object.assign({}, event);

    event.target = event.target || this;
    event.currentTarget = this;

    Object.freeze(event);

    listeners.forEach((listener) => {
      listener.handler(event, listener);
    });
  }
}

class EventListener {
  constructor(eventType, handler, dispatcher) {
    this._type = eventType;
    this._handler = handler;
    this._dispatcher = dispatcher;
  }

  get type() {
    return this._type;
  }

  get handler() {
    return this._handler;
  }

  remove() {
    this._dispatcher.removeListener(this);
  }
}
