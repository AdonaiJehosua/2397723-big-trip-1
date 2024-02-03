import FilterPresenter from './presenter/filter';
import TripEventsPresenter from './presenter/trip-events';
import EventModel from './model/event-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button.js';
import { render } from './framework/render.js';

const headerFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripHeaderMainElement = document.querySelector('.trip-main');
const eventModel = new EventModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: headerFiltersElement,
  filterModel,
  eventModel
});

const tripEventsPresenter = new TripEventsPresenter({
  tripEventsContainer: tripEventsElement,
  onNewEventDestroy: handleNewEventFormClose,
  eventModel,
  offersModel,
  destinationsModel,
  filterModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventButtonClick() {
  tripEventsPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

filterPresenter.init();
tripEventsPresenter.init();
render(newEventButtonComponent, tripHeaderMainElement);
