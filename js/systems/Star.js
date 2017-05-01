import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, radius, parent, orbitRadius, orbitOffset, luminosity) {
    super(name, mass, radius, parent, orbitRadius, orbitOffset);

    this._luminosity = luminosity || null;
  }

  get luminosity () {
    return this._luminosity;
  }

  get type () {
    return 'star';
  }

}
