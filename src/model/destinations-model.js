import destinations from '../mock/destinations.json';
import { getByKey } from '../utils';

export default class DestinationsModel {
  destinations = destinations;

  getDestinations() {
    return this.destinations;
  }

  getEventsDestination(id) {
    const eventsDestination = getByKey('id', id, destinations);
    return eventsDestination;
  }
}
