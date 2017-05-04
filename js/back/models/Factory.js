import {System} from './system/System';
import {Star} from './system/Star';
import {GasGiant} from './system/GasGiant';
import {Planet} from './system/Planet';
import {OrbitRegular} from './system/OrbitRegular';

let id = 0;

const getId = (data) => {
  if('id' in data) {
    return data.id;
  }

  return id++;
}

export const Factory = {
  getSystem: (system) => {
    const bodies = [];
    const bodiesById = {};

    system.bodies.forEach((data) => {
      const body = Factory.getBody(data, bodiesById);

      bodiesById[body.id] = body;
      bodies.push(body);
    });

    return new System(getId(system), bodies);
  },
  getBody: (body, otherModelsById) => {
    const orbit = Factory.getOrbit(body.orbit);

    switch(body.type) {
      case 'star':
        //id, mass, radius, day, axialTilt, tidalLock, parent, orbit, luminosity
        return new Star(getId(body), +body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherModelsById[body.parent] || null, orbit, body.luminosity );
      case 'gas giant':
        //id, mass, radius, day, axialTilt, tidalLock, parent, orbit, minerals, colonies
        return new GasGiant(getId(body), +body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherModelsById[body.parent] || null, orbit, null, null );
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //id, mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies, atmosphere, type
        return new Planet(getId(body), +body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherModelsById[body.parent] || null, orbit, body.albedo, null, null, null, body.type );
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
        return new OrbitRegular(getId(data), data.radius, data.offset);
      default:
        throw new Error('Not implemented');
    }
  }
}

Object.freeze(Factory);
