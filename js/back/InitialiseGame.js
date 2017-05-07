const knownSystemsData = require('../data/systems');

import {System} from './models/system/System';
import {Star} from './models/system/Star';
import {GasGiant} from './models/system/GasGiant';
import {Planet} from './models/system/Planet';
import {OrbitRegular} from './models/system/OrbitRegular';
import {Colony} from './models/Colony';


export class InitialiseGame {

}

InitialiseGame.createSystemFromKnown = (systemName, bodiesByName, preferredEnvs) => {
  const systemData = getKnownSystemByName(systemName);
  const bodies = [];
  bodiesByName = bodiesByName || {};
  preferredEnvs = preferredEnvs || {};

  systemData.bodies.forEach((bodyData) => {
    bodies.push(createBody(bodyData, bodiesByName));

    if(bodyData.startingColony) {
      preferredEnvs[bodyData.name] = bodyData.startingColony;
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
  const system = InitialiseGame.createSystemFromKnown(systemName, bodiesByName, preferredEnvs);

  //faction knows about this system
  faction.addKnownSystem(system, factionSystemName);

  //name planets
  for(let name in bodiesByName) {
    faction.setSystemBodyName(bodiesByName[name], name);
  }

  //set the starting colony for this faction
  for(let name in preferredEnvs) {
    if(preferredEnvs.hasOwnProperty(name) && preferredEnvs[name] == preferredEnv) {
      startingColonySystemBody = bodiesByName[name];
      break;
    }
  }

  if(!startingColonySystemBody) {
    throw new Error('No suitable starting planet for this faction');
  }

  const colony = createColony(colonyData, startingColonySystemBody);

  //Assign colony to faction
  faction.addColony(colony);

  //Done!
  return system;
}

//TODO minerals?
function createColony(colonyData, systemBody) {
  return new Colony(systemBody, colonyData.population, colonyData.minerals || null);
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
