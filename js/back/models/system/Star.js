import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit, luminosity) {
    super(mass, radius, day, axialTilt, tidalLock, parent, orbit);

    this._luminosity = luminosity || null;

    this._bodyState['class'] = 'Star';
    this._bodyState.luminosity = luminosity;

    //TODO freeze state object
  }

  get luminosity () {
    return this._luminosity;
  }

  get type () {
    return 'star';
  }
}
