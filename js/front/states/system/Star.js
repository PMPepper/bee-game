import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, radius, day, axialTilt, tidalLock, parent, luminosity) {
    super(name, mass, radius, day, axialTilt, tidalLock, parent);

    this._luminosity = luminosity || null;
  }

  get luminosity () {
    return this._luminosity;
  }

  get type () {
    return 'star';
  }

}
