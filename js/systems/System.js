export class System {
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

}
