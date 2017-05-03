import {SubStellarBody} from './SubStellarBody';

export class Planet extends SubStellarBody {
  constructor (name, mass, radius, parent, orbit, albedo, minerals, colonies, atmosphere, type) {
    super(name, mass, radius, parent, orbit, albedo, minerals, colonies);

    this._atmosphere = atmosphere;
    this._type = type;

    this._bodyState.type = type;

    this._bodyState['class'] = 'Planet';
  }


  update(newTime) {
    const lastTime = this.time;

    super.update(newTime);

    //TODO update colonies, minerals, etc
  }


  get atmosphere () {
    return this._atmosphere;
  }

  get type () {
    return this._type;
  }
}
