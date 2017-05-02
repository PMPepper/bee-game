import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, radius, parent, orbit, luminosity) {
    super(name, mass, radius, parent, orbit);

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