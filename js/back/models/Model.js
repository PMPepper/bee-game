let id = 0;

const allModelsById = {};


export class Model {
  constructor() {
    this._id = id++;

    allModelsById[this._id] = this;
  }

  get id () {
    return this._id;
  }

  _state (obj) {
    obj['class'] = this.constructor.name;
    obj.id = this.id;

    return obj;
  }

  /*getArrayState (arr) {
    const state = [];

    arr.forEach((val) => {state.push(val.getState());});

    return state;
  }*/

  getStateIds (arr) {
    return arr.map((val) => {
      return Model.id(val);
    });
  }

  getObjectState (obj) {
    const state = [];

    for( let id in obj) {
      if(obj.hasOwnProperty(id) && (obj[id] instanceof Model)) {
        state.push(obj[id].id);
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

  discard() {
    if(!this.isDiscarded) {
      delete allModelsById[this._id];
    }
  }

  get isDiscarded() {
    return allModelsById[this._id] != this;
  }
}

Model.id = (model) => {
  if(model instanceof Model) {
    return model.id;
  } else if(!model) {
    return null;
  }

  return model;
}

Model.getById = (id) => {
  return allModelsById[id] || null;
};
