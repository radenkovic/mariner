# Events

Events module is implementation of node [events](https://nodejs.org/api/events.html#events_events).
Module requires no configuration and usage is quite trivial:

```
import { Events } from 'node-mariner';

// Register the event listener
const PubSub = new Events();


// Register event
const sampleMessageListener = message => {
  console.log('You sent sample message', message)
}

PubSub.on('sample-message', sampleMessageListener)

// Check if listener is properly registered
console.log(PubSub.count()) // returns 1

// Emit the event
PubSub.emit('sample-message', 'this is dummy message')
// results in 'You sent sample message', 'this is a dummy message'

// Deregister the listener
PubSub.off('sample-message', sampleMessageListener);

// Check if listener is properly deregistered
console.log(PubSub.count()) // returns 0

```

# Methods

| method             | arguments     | description                                                                                   |
| -------------------|----------|-----------------------------------------------------------------------------------------------|
| on              | (`eventName`, `callback`) | register listener for provided `eventName`                                                 |
| off             | (`eventName`, `callback`) | unregister listener for provided `eventName`   |
| emit            | (`eventName`, `payload`) | emit an event  for particular `eventName`                 |
| count | none | returns count`<integer>` of registered listeners to particular Event object