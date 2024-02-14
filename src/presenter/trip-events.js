import { RenderPosition, remove, render } from '../framework/render';
import EventsBoardView from '../view/events-board';
import LoadingView from '../view/loading';
import EventPresenter from './event';
import EmptyEventsListView from '../view/empty-events-list';
import SortPresenter from './sort';
import { sortDateDown, sortTimeUp, sortPriceUp, filter } from '../utils';
import { UserAction, UpdateType, FilterType } from '../const';
import NewEventPresenter from './new-event-presenter';

const Sort = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price'
};
export default class TripEventsPresenter {
  #tripEventsContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #eventPresenters = new Map();

  #sortPresenter = null;
  #newEventPresenter = null;

  #currentSortType = Sort.DAY;
  #filterType = FilterType.EVERYTHING;

  #eventsBoard = new EventsBoardView();
  #loadingComponent = new LoadingView();
  #emptyEventsListView = null;

  #isLoading = true;

  #onNewEventDestroy = null;

  constructor({ tripEventsContainer, eventsModel, offersModel, destinationsModel, filterModel, onNewEventDestroy }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#onNewEventDestroy = () => {
      if (this.events.length === 0) {
        this.#emptyEventsListView = new EmptyEventsListView(this.#filterType);
        render(this.#emptyEventsListView, this.#tripEventsContainer);
      }
      onNewEventDestroy();
    };

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    switch (this.#currentSortType) {
      case Sort.DAY:
        return filteredEvents.sort(sortDateDown);
      case Sort.TIME:
        return filteredEvents.sort(sortTimeUp);
      case Sort.PRICE:
        return filteredEvents.sort(sortPriceUp);
    }
    return filteredEvents;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init() {
    this.#renderLoading();
    render(this.#eventsBoard, this.#tripEventsContainer);
  }

  createEvent() {
    this.#newEventPresenter = new NewEventPresenter({
      newEventFormContainer: this.#eventsBoard.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewEventDestroy
    });

    this.#currentSortType = Sort.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#emptyEventsListView) {
      remove(this.#emptyEventsListView);
      render(this.#eventsBoard, this.#tripEventsContainer);
    }
    this.#newEventPresenter.init();
  }

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      currentSortType: this.#currentSortType,
      boardComponent: this.#tripEventsContainer,
      onSortOptionChange: this.#handleSortOptionChange
    });
    this.#sortPresenter.init();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard({ resetSortType: false });
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortOptionChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({ resetSortType: false });
    this.#renderEvents();
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      offers: this.offers,
      destinations: this.destinations,
      eventsBoard: this.#eventsBoard,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents() {
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderEmptyEventsList() {
    this.#emptyEventsListView = new EmptyEventsListView(this.#filterType);
    render(this.#emptyEventsListView, this.#tripEventsContainer);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.#emptyEventsListView) {
      remove(this.#emptyEventsListView);
    }
    if (this.events.length === 0) {
      if (this.#sortPresenter) {
        this.#sortPresenter.destroy();
      }
      this.#renderEmptyEventsList();
    }
    if (!this.#sortPresenter) {
      this.#renderSort();
    }

    this.#renderEvents();
  }

  #clearBoard({ resetSortType }) {
    if (resetSortType) {
      this.#currentSortType = Sort.DAY;
      if (this.#sortPresenter) {
        this.#sortPresenter.destroy();
        this.#sortPresenter.init();
      }
    }
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
  }
}
