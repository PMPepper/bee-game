const knownSystemsData = require('../data/systems');

import {System} from './models/system/System';
import {Star} from './models/system/Star';
import {GasGiant} from './models/system/GasGiant';
import {Planet} from './models/system/Planet';
import {SubStellarBody} from './models/system/SubStellarBody';
import {OrbitRegular} from './models/system/OrbitRegular';
import {SystemBodyMinerals} from './models/system/SystemBodyMinerals';
import {Colony} from './models/Colony';


export class InitialiseGame {

}

InitialiseGame.getGamConfig = () => {
  return Object.freeze({});
}

InitialiseGame.createSystemFromKnown = (systemName, bodiesByName, preferredEnvs, skipMinerals) => {
  const systemData = getKnownSystemByName(systemName);
  const bodies = [];
  bodiesByName = bodiesByName || {};
  preferredEnvs = preferredEnvs || {};

  systemData.bodies.forEach((bodyData) => {
    const body = createBody(bodyData, bodiesByName);

    bodies.push(body);

    if(bodyData.startingColony) {
      preferredEnvs[bodyData.name] = bodyData.startingColony;
    }

    if(!skipMinerals && (body instanceof SubStellarBody)) {
      body.minerals = SystemBodyMinerals.createMineralsFor(body, 1);//TODO vary plentifulness
    }
  });

  return new System(bodies);
}

//TODO 'preferedEnv' system is pretty primitive. Will need to replace when I
//add planetary envirnoments, etc
InitialiseGame.createHomeSystemFromKnownFor = (systemName, factionSystemName, faction, preferredEnv, colonyData) => {
  const bodiesByName = {};
  const preferredEnvs = {};
  let startingColonySystemBody = null;

  //create the system
  const system = InitialiseGame.createSystemFromKnown(systemName, bodiesByName, preferredEnvs, true);

  //faction knows about this system
  faction.addKnownSystem(system, factionSystemName, null);

  //name planets
  for(let name in bodiesByName) {
    faction.setSystemBodyName(bodiesByName[name], name);
  }

  //set the starting colony for this faction
  //TOOD this is pretty primitive, will need to improve when I put proper
  //envirnoments and species stuff in
  for(let name in preferredEnvs) {
    if(preferredEnvs.hasOwnProperty(name) && preferredEnvs[name] == preferredEnv) {
      startingColonySystemBody = bodiesByName[name];

      //mark your starting colony as surveyed
      faction.getKnownSystemBody(startingColonySystemBody).isSurveyed = true;
      break;
    }
  }

  //now init minerals
  system.bodies.forEach((body) => {
    if(body == startingColonySystemBody) {
      body.minerals = SystemBodyMinerals.createMineralsFor(body, 2);//starting colony begins rich
    } else {
      body.minerals = SystemBodyMinerals.createMineralsFor(body, 1);//TODO vary plentifulness
    }
  });

  if(!startingColonySystemBody) {
    throw new Error('No suitable starting planet for this faction');
  }

  const colony = createColony(colonyData, faction, startingColonySystemBody);

  //Done!
  return system;
}

//TODO minerals?
function createColony(colonyData, faction, systemBody) {
  return new Colony(faction, systemBody, colonyData.population, colonyData.minerals || null);
}

function getKnownSystemByName(name) {
  for( let i = 0; i < knownSystemsData.length; i++) {
    if(knownSystemsData[i].name == name) {
      return knownSystemsData[i];
    }
  }

  return null;
}

function createBody(body, otherBodiesByName) {
  const orbit = createOrbit(body.orbit);
  let bodyModel = null;

  switch(body.type) {
    case 'star':
      //mass, radius, day, axialTilt, tidalLock, parent, orbit, luminosity
      bodyModel = new Star(+body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherBodiesByName[body.parent] || null, orbit, body.luminosity );
      break;
    case 'gas giant':
      //mass, radius, day, axialTilt, tidalLock, parent, orbit, minerals, colonies
      bodyModel = new GasGiant(+body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherBodiesByName[body.parent] || null, orbit, null, null );
      break;
    case 'planet':
    case 'dwarf planet':
    case 'moon':
      //mass, radius, day, axialTilt, tidalLock, parent, orbit, albedo, minerals, colonies, atmosphere, type
      bodyModel = new Planet(+body.mass, +body.radius, +body.day, +body.axialTilt, !!body.tidalLock, otherBodiesByName[body.parent] || null, orbit, body.albedo, null, null, null, body.type );
      break;
    case 'asteroid':
      throw new Error('Not implemented');
    case 'comet':
      throw new Error('Not implemented');
    default:
      throw new Error('Not implemented');
  }

  if(bodyModel) {
    otherBodiesByName[body.name] = bodyModel;
  }

  return bodyModel;
}

function createOrbit(data) {
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
