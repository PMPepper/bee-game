export class System {
  constructor(name, bodies) {
    this._name = name;
    this._bodies = bodies ? bodies.slice() : [];

    this._bodies.forEach((body)=>{body._system = this;})
  }

  get name () {
    return this._name;
  }

  get bodies () {
    return this._bodies;
  }

}
