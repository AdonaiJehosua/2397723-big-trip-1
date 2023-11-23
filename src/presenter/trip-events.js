import { render, RenderPosition } from '../render';
import SortView from '../view/sort';
import EventView from '../view/event';
import EventsBoardView from '../view/events-board';
import FormView from '../view/form';
import EmptyEventsListView from '../view/empty-events-list';

export default class TripEventsPresenter {

  constructor({ tripEventsContainer, eventsModel, offersModel, destinationsModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.eventsModel = eventsModel;
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
  }

  init() {
    this.events = [...this.eventsModel.getEvents()];
    this.offers = [...this.offersModel.getOffers()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.eventsBoard = new EventsBoardView();

    if (this.events) {
      render(new SortView(), this.tripEventsContainer);
      render(this.eventsBoard, this.tripEventsContainer);
      this.renderEvents(this.events);
      render(new FormView({ event: this.events[1], offers: this.offers, destinations: this.destinations }), this.eventsBoard.getElement(), RenderPosition.AFTERBEGIN);
      render(new FormView({ offers: this.offers, destinations: this.destinations }), this.eventsBoard.getElement(), RenderPosition.AFTERBEGIN);
    } else {
      render(new EmptyEventsListView('Everything'), this.tripEventsContainer);
    }
  }

  renderEvents(events) {
    for (const event of events) {
      render(
        new EventView({
          event: event,
          offers: this.offersModel.getEventsOffers({
            type: event.type,
            ids: event.offers
          }),
          destination: this.destinationsModel.getEventsDestination(event.destination)
        }),
        this.tripEventsContainer
      );
    }
  }
}
