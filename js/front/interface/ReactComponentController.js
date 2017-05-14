import {EventDispatcher} from '../../core/EventDispatcher';

export class ReactComponentController extends EventDispatcher {
  constructor() {
    super();

    this._doReRender = this._doReRender.bind(this);
  }

  _onSetElement(element) {
    this._element = element;
  }

  _doReRender() {
    this.dispatchEvent({type: 'changed'});
  }
}
