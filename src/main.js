import FilterPresenter from './presenter/filter';
import TripEventsPresenter from './presenter/trip-events';
import EventModel from './model/event-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const eventsModel = new EventModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filterPresenter = new FilterPresenter({ container: headerFiltersElement });
const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: tripEventsElement,
  eventsModel,
  offersModel,
  destinationsModel
});

filterPresenter.init();
tripEventsPresenter.init();
