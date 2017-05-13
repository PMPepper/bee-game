import {EventDispatcher} from '../../core/EventDispatcher';

export class ReactComponentController extends EventDispatcher {
  constructor() {
    super();
  }

  _onSetElement(element) {
    this._element = element;
  }

  _doReRender() {
    this.dispatchEvent({type: 'changed'});
  }
}
