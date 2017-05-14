import {EventDispatcher} from '../../core/EventDispatcher'

export class State extends EventDispatcher {
  constructor(id) {
    super();

    this._id = id;
  }

  get id() {
    return this._id;
  }

  _changed() {
    this.dispatchEvent({type:'changed'});
  }
}
