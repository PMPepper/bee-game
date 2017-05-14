import {SubStellarBody} from './SubStellarBody';

export class GasGiant extends SubStellarBody {
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit, minerals, colonies) {
    super(mass, radius, day, axialTilt, tidalLock, parent, orbit, -1, minerals, colonies);

    this._bodyState['class'] = 'GasGiant';
  }

  update(newTime, deltaTime, events) {
    const lastTime = this.time;

    super.update(newTime, deltaTime, events);
  }

  get type () {
    return 'gas giant';
  }
}
