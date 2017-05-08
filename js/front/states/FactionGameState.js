import {GasGiant} from './system/GasGiant';
import {OrbitRegular} from './system/OrbitRegular';
import {Planet} from './system/Planet';
import {Star} from './system/Star';
import {System} from './system/System';
import {SystemBodyState} from './system/SystemBodyState';
import {Faction} from './Faction';
import {KnownSystem} from './KnownSystem';
import {KnownFaction} from './KnownFaction';
import {Coord} from '../../core/Coord';

export class FactionGameState extends Faction {
  constructor(stateObj) {
    const id = +Object.keys(stateObj.factionEvents)[0];
    const model = stateObj.models[id];

    super(
      id,
      model.name,
      [],
      []
    );

    this._time = stateObj.time;
    this._events = stateObj.factionEvents[id];

    this._factions = [this];
    this._systems = [];

    this._models = stateObj.models;
    this._statesById = {};
    this._statesById[id] = this;

    //now fully parse the state object
    this._knownFactions = this._getState(model.knownFactionIds);
    this._knownSystems = this._getState(model.knownSystemIds);

    //Once parsing is complete
    delete this._models;
  }

  //state object parsing methods
  _getState(data) {
    if(!data) {
      return null;
    }

    if(data instanceof Array) {
      return this._getArray(data);
    }

    let state = null;

    switch(data['class']) {
      //faction states
      case 'Faction':
        state = this._getFaction(data);
        break;
      case 'KnownFaction':
        state = this._getKnownFaction(data);
        break;
      case 'KnownSystem':
        state = this._getKnownSystem(data);
        break;

      //System states
      case 'System':
        state = this._getSystem(data);
        break;
      case 'SystemBodyState':
        state = this._getSystemBodyState(data);
        break;
      case 'Star':
      case 'Planet':
      case 'GasGiant':
        state = this._getSystemBody(data);
        break;
      case 'Orbit':
      case 'OrbitRegular':
        state = this._getOrbit(data);
        break;

      //Misc
      case 'Coord':
        return new Coord(data.x, data.y);
    }

    if(state) {
      this._addState(state);
    }

    return state;
  }

  _getArray(arr) {
    return arr.map((data) => {
      return this._getStateById(data);
    });
  }

  _getFaction(data) {
    if(!data) {
      return null;
    }

    //id, name, knownFactions, knownSystems
    return new Faction(
      data.id,
      data.name,
      this._getState(data.knownFactionIds),
      this._getState(data.knownSystemIds)
    );
  }

  _getKnownFaction(data) {
    if(!data) {
      return null;
    }

    //id, faction, name
    return new KnownFaction(data.id, this._getStateById(data.factionId), data.name);
  }

  _getKnownSystem(data) {
    if(!data) {
      return null;
    }

    //id, system, name, discoveryDate, knownJumpPoints
    return new KnownSystem(data.id, this._getStateById(data.systemId), data.name, data.discoveryDate, data.knownJumpPoints);//TODO known jump points
  }

  _getSystem(data) {
    const bodies = data.bodyIds.map((bodyId) => {
      return this._getStateById(bodyId);
    });

    const state = new System(data.id, bodies);

    return state;
  }

  _getSystemBodyState(data) {
    const state = new SystemBodyState(
      this._getState(data.body),
      this._getState(data.position),
      this._getStateById(data.orbitId));

    return state;
  }

  _getSystemBody(data) {
    let state = null;

    const name = '?';//TODO get name from models

    switch(data.type) {
      case 'star':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, luminosity
        state = new Star(data.id, name, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, this._getStateById(data.parentId), data.luminosity );
      case 'gas giant':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, minerals, colonies
        state = new GasGiant(data.id, name, data.mass, data.radius, data.day, data.axialTilt, data.tidalLock, this._getStateById(data.parentId), null, null );
      case 'planet':
      case 'dwarf planet':
      case 'moon':
        //id, name, mass, radius, day, axialTilt, tidalLock, parent, albedo, minerals, colonies, surfaceHeating, minSurfaceHeating, maxSurfaceHeating, avgSurfaceHeating, surfaceTemp, minSurfaceTemp, maxSurfaceTemp, avgSurfaceTemp, atmosphere, type
        state = new Planet(
          data.id,
          name,
          data.mass,
          data.radius,
          data.day,
          data.axialTilt,
          data.tidalLock,
          this._getStateById(data.parentId),
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

        break;
      case 'asteroid':
        throw new Error('Not implemented');
      case 'comet':
        throw new Error('Not implemented');
      default:
        throw new Error('Not implemented');
    }

    return state;
  }

  _getOrbit(data) {
    if(!data) {
      return null;
    }

    let state = null;

    switch(data['class']) {
      case 'OrbitRegular':
        //period, radius, angle
        state = new OrbitRegular(data.id, data.period, data.radius, data.angle);
        break;
      default:
        throw new Error('Not implemented');
    }

    return state;
  }

  _addState(state) {
    if(!state) {
      return;
    }

    this._statesById[state.id] = state;

    switch(state.constructor.name) {
      case 'System':
        this._systems.push(state);
        break;
      case 'KnownSystem':
        this._knownSystems.push(state);
        break;
    }
  }

  _getStateById(id) {
    return this._statesById.hasOwnProperty(id) ? this._statesById[id] : ( this._models.hasOwnProperty(id) ? this._getState(this._models[id]) : null);
  }


  //Getters/setters
  get time() {
    return this._time;
  }

  get factionId() {
    return this._factionId;
  }

  get factionName() {
    return this.factionName;
  }

  get systems() {
    return this._systems;
  }

  get events() {
    return this._events;
  }
}
