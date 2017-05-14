import {SubStellarBody} from './SubStellarBody';

export class Planet extends SubStellarBody {
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies, atmosphere, type) {
    super(mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies);

    this._atmosphere = atmosphere;
    this._type = type;

    this._bodyState.type = type;

    this._bodyState['class'] = 'Planet';
  }


  update(newTime, deltaTime, events) {

    super.update(newTime, deltaTime, events);
  }


  get atmosphere () {
    return this._atmosphere;
  }

  get type () {
    return this._type;
  }
}
