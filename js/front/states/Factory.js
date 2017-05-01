import {Game} from './Game';

import {GasGiant} from './system/GasGiant';
import {OrbitRegular} from './system/OrbitRegular';
import {Planet} from './system/Planet';
import {Star} from './system/Star';
import {System} from './system/System';
import {SystemBodyState} from './system/SystemBodyState';
import {Coord} from '../../core/Coord';

//Generates state objects from serialised data

export const Factory = {
  getState: (data, params) => {

    if(data instanceof Array) {

    }

    switch(data['class']) {
      case 'Game':
        return Factory.getGame(data, params);
      case 'StepEvents':
        return null;//TODO
      case 'stepEvent':
        return null;//TODO
        
      //System states
      case 'System':
        return Factory.getSystem(data, params);
      case 'SystemBodyState':
        return Factory.getSystemBodyState(data, params)
      case 'Star':
      case 'Planet':
      case 'GasGiant':
        return Factory.getBody(data, params);
      case 'Orbit':
      case 'OrbitRegular':
        return Factory.getOrbit(data, params);

      //Misc
      case 'Coord':
        return new Coord(coord.x, coord.y);
    }

    return null;
  },
  getArray: (arr) => {
    const output = [];

    arr.forEach((data) => {
      output.push(Factory.getState(data));
    });

    return output;
  },
  getGame: (data) => {
    return new Game(data.time, Factory.getState(data.systems), Factory.getState(data.events));
  },
  getSystemBodyState: (data) => {
    return new SystemBodyState(
      Factory.getState(data.body),
      Factory.getState(data.position),
      Factory.getState(data.orbit));
  },
  getSystem: (system) => {
    const bodies = [];
    const bodiesByName = {};

    system.bodies.forEach((data) => {
      const body = Factory.getState(data, bodiesByName);

      bodiesByName[body.name] = body;
      bodies.push(body);
    });

    return new System(system.name, bodies);
  },
  getBody: (body, otherBodiesByName) => {
    switch(body.type) {
      case 'star':
        //name, mass, radius, parent, luminosity
        return new Star(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, body.luminosity );
      case 'gas giant':
        //name, mass, radius, parent, minerals, colonies
        return new GasGiant(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, null, null );
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //name, mass, radius, parent, albedo, minerals, colonies, atmosphere, type
        return new Planet(body.name, body.mass, body.radius, otherBodiesByName[body.parent] || null, body.albedo, null, null, null, body.type );
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
        //period, radius, angle
        return new OrbitRegular(data.period, data.radius, data.angle);
      default:
        throw new Error('Not implemented');
    }
  }
};

Object.freeze(Factory);
