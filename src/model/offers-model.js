import offers from '../mock/offers.json';
import { getById, getByKey } from '../utils';

export default class OffersModel {
  offers = offers;

  getOffers() {
    return this.offers;
  }

  getEventsOffers({type, ids}) {
    const currentOffers = getByKey('type', type, this.offers);
    const eventsOffers = [];
    ids.forEach((item) => (
      eventsOffers.push(getById(item, currentOffers.offers))
    ));
    return eventsOffers;
  }
}
