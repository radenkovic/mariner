import { EventEmitter } from 'events';

export default class Events {
  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  on(event, listener) {
    this.eventEmitter.addListener(event, listener);
  }

  off(event, listener) {
    this.eventEmitter.removeListener(event, listener);
  }

  emit(event, ...args) {
    this.eventEmitter.emit(event, ...args);
  }

  count(event) {
    return EventEmitter.listenerCount(this.eventEmitter, event);
  }
}
