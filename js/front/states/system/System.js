import {Immutable} from '../../../core/Immutable';

export class System extends Immutable {
  constructor(name, bodies) {
    this._name = name;
    this._bodies = bodies ? bodies.slice() : [];
    this._stars = [];

    this._bodies.forEach((body)=>{
      body._system = this;

      if(body.type == 'star') {
        this._stars.push(body);
      }
    })

    Object.freeze(this._bodies);
    Object.freeze(this._stars);

    this._freeze(System);
  }

  get name () {
    return this._name;
  }

  get bodies () {
    return this._bodies;
  }

  get stars () {
    return this._stars;
  }

  getBodyByName(name) {
    const bodies = this.bodies;

    for( let i = 0; i < bodies.length; i++) {
      if(bodies[i].name == name) {
        return bodies[i];
      }
    }

    return null;
  }

}
