import {SystemBody} from './SystemBody';

export class Star extends SystemBody {
  constructor (name, mass, radius, parent, orbitRadius, orbitOffset, output) {
    super(name, mass, radius, parent, orbitRadius, orbitOffset);

    this._output = output || null;
  }

  get output () {
    return this._output;
  }

  get type () {
    return 'star';
  }

}
