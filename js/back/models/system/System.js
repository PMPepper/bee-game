import {Model} from '../Model';

export class System extends Model {
  constructor(id, bodies) {
    super(id);

    this._bodies = bodies ? bodies.slice() : [];

    this._bodies.forEach((body)=>{
      body.setSystem(this);
    })
  }

  get bodies () {
    return this._bodies;
  }

  get stars () {
    return this._bodies.filter((body) => {
      return body.type == 'star';
    });
  }

  getBodyById (id) {
    for(let i = 0;i < this.bodies.length; i++) {
      if(this.bodies[i].id == id) {
        return this.bodies[i];
      }
    }

    return null;
  }

  //TODO ???
  getBodyByName (name) {
    const bodies = this.bodies;

    for( let i = 0; i < bodies.length; i++) {
      if(bodies[i].name == name) {
        return bodies[i];
      }
    }

    return null;
  }

  update (newTime, events) {
    //need to update position..
    this.bodies.forEach((body) => { body.updatePosition(newTime) } );

    //then see what has happened as a result
    this.bodies.forEach((body) => { body.update(newTime, events) } );
  }

  getState() {
    return this._state({
      bodies: this.getArrayState(this.bodies)
    });
  }

}
