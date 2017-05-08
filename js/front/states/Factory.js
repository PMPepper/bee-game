import {GasGiant} from './system/GasGiant';
import {OrbitRegular} from './system/OrbitRegular';
import {Planet} from './system/Planet';
import {Star} from './system/Star';
import {System} from './system/System';
import {SystemBodyState} from './system/SystemBodyState';
import {Coord} from '../../core/Coord';

//Generates state objects from serialised data

export const Factory = {
  getState: (data, models, states) => {
    if(!data) {
      return null;
    }

    if(data instanceof Array) {
      return Factory.getArray(data, models, states);
    }

    switch(data['class']) {
      //System states
      case 'System':
        return Factory.getSystem(data, models, states);
      case 'SystemBodyState':
        return Factory.getSystemBodyState(data, models, states)
      case 'Star':
      case 'Planet':
      case 'GasGiant':
        return Factory.getBody(data, models, states);
      case 'Orbit':
      case 'OrbitRegular':
        return Factory.getOrbit(data, models, states);

      //Misc
      case 'Coord':
        return new Coord(data.x, data.y);
    }

    return null;
  },
  getArray: (arr, models, states) => {
    const output = [];

    arr.forEach((data) => {
      output.push(Factory.getState(data, models, states));
    });

    return output;
  },
  getSystemBodyState: (data, models, states) => {
    const systemBodyState = new SystemBodyState(
      Factory.getState(data.body, models, states),
      Factory.getState(data.position, models, states),
      Factory.getState(data.orbit, models, states));

    states[systemBodyState.id] = systemBodyState;

    return systemBodyState;
  },
  getSystem: (data, models, states) => {
    const bodies = [];

    data.bodies.forEach((bodyData) => {
      const body = Factory.getState(bodyData, models, states);

      states[body.id] = body;
      bodies.push(body);
    });

    return new System(system.name, bodies);
  },
  getBody: (data, models, states) => {
    let body = null;

    const name = '?';//TODO get name from models

    switch(data.type) {
      case 'star':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, luminosity
        body = new Star(data.id, name, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, states[data.parentId] || null, data.luminosity );
      case 'gas giant':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, minerals, colonies
        body = new GasGiant(data.id, name, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, states[data.parentId] || null, null, null );
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp, atmosphere, type
        body = new Planet(
            data.id,
            name,
            data.mass,
            data.radius,
            data.day,
            data.axialTilt,
            data.tidalLock,
            states[data.parentId] || null,
            data.albedo,
            null,
            null,
            data.surfaceHeating,
            data.minSurfaceHeating,
            data.maxSurfaceHeating,
            data.avgSurfaceHeating,
            data.surfaceTemp,
            data.minSurfaceTemp,
            data.maxSurfaceTemp,
            data.avgSurfaceTemp,
            data.type );
      case 'asteroid':
        throw new Error('Not implemented');
      case 'comet':
        throw new Error('Not implemented');
      default:
        throw new Error('Not implemented');
    }

    states[body.id] = body;
  },
  getOrbit: (data) => {
    if(!data) {
      return null;
    }

    let state = null;

    switch(data['class']) {
      case 'OrbitRegular':
        //period, radius, angle
        state = new OrbitRegular(data.period, data.radius, data.angle);
      default:
        throw new Error('Not implemented');
    }

    states[state.id] = state;
  }
};

Object.freeze(Factory);
