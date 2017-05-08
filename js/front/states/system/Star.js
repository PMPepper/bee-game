import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (id, name, mass, radius, day, axialTilt, tidalLock, parent, luminosity) {
    super(id, name, mass, radius, day, axialTilt, tidalLock, parent);

    this._luminosity = luminosity || null;
  }

  get luminosity () {
    return this._luminosity;
  }

  get type () {
    return 'star';
  }

}
