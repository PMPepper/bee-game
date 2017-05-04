
export class Model {
  constructor(id) {
    this._id = id;
  }

  get id () {
    return this._id;
  }

  _state (obj) {
    obj['class'] = this.constructor.name;
    obj.id = this.id;

    return obj;
  }

  getArrayState (arr) {
    const state = [];

    arr.forEach((val) => {state.push(val.getState());});

    return state;
  }

  getStateIds (arr) {
    const state = [];

    arr.forEach((val) => {state.push(arr.id);});

    return state;
  }

  getObjectState (obj) {
    const state = [];

    for( let prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        state.push(obj[prop].getState());
      }
    }

    return state;
  }

  getState () {
    return {
      'class': this.constructor.name,
      id: this.id
    };
  }
}

Model.id = (model) => {
  if(model instanceof Model) {
    return model.id;
  }

  return model;
}
