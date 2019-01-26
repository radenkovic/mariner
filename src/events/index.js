// @flow
import EventEmitter from 'events';

export default class Events extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  count(event: string) {
    return this.listenerCount(event);
  }
}
