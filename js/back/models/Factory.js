import {System} from './system/System';
import {Star} from './system/Star';
import {GasGiant} from './system/GasGiant';
import {Planet} from './system/Planet';
import {OrbitRegular} from './system/OrbitRegular';

export const Factory = {
  getSystem: (system) => {
    const bodies = [];
    const bodiesByName = {};

    system.bodies.forEach((data) => {
      const body = Factory.getBody(data, bodiesByName);

      bodiesByName[body.name] = body;
      bodies.push(body);
    });

    return new System(system.name, bodies);
  },
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
        return new OrbitRegular(data.radius, data.offset);
      default:
        throw new Error('Not implemented');
    }
  }
}

Object.freeze(Factory);
