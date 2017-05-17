import {State} from '../State';
import {FactionState} from '../FactionState';
import {Colony} from '../Colony';
import {SubStellarBody} from './SubStellarBody';

export class System extends State {
  constructor(id, bodies) {
    super(id);

    this._bodies = bodies ? bodies.slice() : [];
    this._stars = [];

    this._bodies.forEach((body)=>{
      body._system = this;

      if(body.type == 'star') {
        this._stars.push(body);
      }
    })

    this._bodies;
    this._stars;
  }

  get bodies () {
    return this._bodies;
  }

  get stars () {
    return this._stars;
  }

  

  /*getSystemBodyById(id) {
    const bodies = this.bodies;

    for(let i = 0; i < bodies.length; i++) {
      if(bodies[i].id == id) {
        return bodies[i];
      }
    }

    return null;
  }*/

  /*getBodyByName(name) {
    const bodies = this.bodies;

    for( let i = 0; i < bodies.length; i++) {
      if(bodies[i].name == name) {
        return bodies[i];
      }
    }

    return null;
  }*/
}
