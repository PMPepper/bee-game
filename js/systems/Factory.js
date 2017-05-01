import {Star} from './Star';
import {GasGiant} from './GasGiant';
import {Planet} from './Planet';
import {RegularOrbit} from './RegularOrbit';

export const Factory = {
  getBody: (body, otherBodiesByName) => {
    const orbit = Factory.getOrbit(body.orbit);

    switch(body.type) {
      case 'star':
        //name, mass, radius, parent, orbit, luminosity
        return new Star(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, orbit, body.luminosity );
      case 'gas giant':
        //name, mass, radius, parent, orbit, minerals, colonies
        return new GasGiant(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, orbit, null, null );
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //name, mass, radius, parent, orbit, albedo, minerals, colonies, atmosphere, type
        return new Planet(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, orbit, body.albedo, null, null, null, body.type );
      case 'asteroid':
        throw new Error('Not implemented');
      case 'comet':
        throw new Error('Not implemented');
      default:
        throw new Error('Not implemented');
    }
  },
  getOrbit: (data) => {
    if(!data) {
      return null;
    }

    switch(data.type) {
      case 'regular':
        return new RegularOrbit(data.radius, data.offset);
      default:
        throw new Error('Not implemented');
    }
  }
}

Object.freeze(Factory);
