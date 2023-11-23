import FilterView from '../view/filter';
import { render } from '../render';
export default class FilterPresenter {
  component = new FilterView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(this.component, this.container);
  }
}
