import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, radius, parent, luminosity) {
    super(name, mass, radius, parent);

    this._luminosity = luminosity || null;

    this._freeze(Star);
  }

  get luminosity () {
    return this._luminosity;
  }

  get type () {
    return 'star';
  }

}
