import events from '../mock/points.json';

export default class EventModel {
  events = events;

  getEvents() {
    return this.events;
  }
}
