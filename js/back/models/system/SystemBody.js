import {Constants} from '../../../core/Constants';
import {Coord} from '../../../core/Coord';

import {Model} from '../Model';

export class SystemBody extends Model{
  constructor (mass, radius, day, axialTilt, tidalLock, parent, orbit) {
    super();

    this._mass = mass;
    this._radius = radius;
    this._day = day;
    this._axialTilt = axialTilt;
    this._tidalLock = tidalLock;
    this._parent = parent || null;
    this._orbit = orbit;
    this._system = null;

    if(orbit) {
      orbit._body = this;
    }

    this._position = null;
    this._time = 0;

    this._bodyState = {
      mass: mass,
      radius: radius,
      day: day,
      axialTilt: axialTilt,
      tidalLock: tidalLock,
      parentId: Model.id(parent),
      type: this.type
    };
  }

  setSystem(system) {
    if(this._system){
      throw new Error('can only set system once');
    }

    this._system = system;
  }

  updatePosition(newTime) {
    this._position = this.getPosition(newTime);
    if(this.orbit) {
      this.orbit.update(newTime);
    }
  }

  update(newTime, events) {

  }

  getState() {
    return this._state({
      body: this._bodyState,
      position: this.position ? this.position.getState() : null,
      orbitId: Model.id(this.orbit),
      systemId: Model.id(this.system)
    });
  }

  get position() {
    return this._position;
  }

  get time() {
    return this._time;
  }

  get mass () {
    return this._mass;
  }

  get radius () {
    return this._radius;
  }

  get day () {
    return this._day;
  }

  get axialTilt () {
    return this._axialTilt;
  }

  get tidalLock () {
    return this._tidalLock;
  }

  get diameter () {
    return this.radius * 2;
  }

  get density () {
    return this.mass / this.density;
  }

  get volume () {
    return (4/3)*Math.PI*Math.pow( this.radius, 3);
  }

  get surfaceGravity () {
    return (Constants.GRAVITATIONAL_CONSTANT * this.mass) / (this.radius * this.radius);
  }

  get escapeVelocity () {
    return Math.sqrt((2*Constants.GRAVITATIONAL_CONSTANT*this.mass)/this.radius);
  }

  get parent () {
    return this._parent;
  }

  get orbit () {
    return this._orbit;
  }

  get system () {
    return this._system;
  }

  get type () {
    throw new Error('Not implemented');
  }

  getPosition(time){
    return this.orbit ? this.orbit.getPosition(time) : Coord.ORIGIN;
  }

  getAncestors () {
    const ancestors = [];

    let curBody = this;

    while(true) {
      curBody = curBody.parent;

      if(curBody != null) {
        ancestors.push(curBody);
      } else {
        return ancestors;
      }
    }
  }
}

//returns temp in kelvin^4
SystemBody.getSurfaceHeating = (luminosity, albedo, distance) => {

  // L⊙(1−a) / 16πd2ơ
  return (luminosity * (1 - albedo)) / (16 * Math.PI * Constants.STEFAN_BOLTZMANN * distance * distance);
}

SystemBody.getBodyDistanceAt = (body1, body2, time) => {
  const pos1 = body1.getPosition(time);
  const pos2 = body2.getPosition(time);

  return Coord.distance(pos1, pos2);
}

function getCommonAncestors(body1, body2) {
  if(body1.system != body2.system) {
    throw new Error('System bodies must be in the same system to compare their distances');
  }

  const body1Ancestors = body1.getAncestors();
  const body2Ancestors = body2.getAncestors();
  let commonAncestor = null;

  body1Ancestors.unshift(body1);
  body2Ancestors.unshift(body2);

  body1Ancestors.reverse();
  body2Ancestors.reverse();

  const minLength = Math.min(body1Ancestors.length, body2Ancestors.length);

  //find first common orbit

  let i = 0;

  for( i = 0; i < minLength; i++) {
    if(body1Ancestors[i] != body2Ancestors[i]) {
      if(i ==0) {
        throw new Error('This should never happen!');
      } else {
        commonAncestor = body2Ancestors[i-1];
        break;
      }
    }
  }

  return {
    body1Ancestors: body1Ancestors,
    body2Ancestors: body2Ancestors,
    ancestorPos: i-1,
    commonAncestor: commonAncestor
  };
}

SystemBody.getMaxBodyDistance = (body1, body2) => {
  const ancestors = getCommonAncestors(body1, body2);
  let i = 0;

  let distance = 0;

  for(i = ancestors.ancestorPos+1; i < ancestors.body1Ancestors.length; i++) {
    distance += ancestors.body1Ancestors[i].orbit.maxRadius;
  }

  for(i = ancestors.ancestorPos+1; i < ancestors.body2Ancestors.length; i++) {
    distance += ancestors.body2Ancestors[i].orbit.maxRadius;
  }

  return distance;
}

SystemBody.getMinBodyDistance = (body1, body2) => {
  const ancestors = getCommonAncestors(body1, body2);
  const distances = [];

  for(let i = ancestors.ancestorPos+1; i < ancestors.body1Ancestors.length; i++) {
    let curAncestor = ancestors.body1Ancestors[i];

    distances.push({
      name: curAncestor.name +'-'+curAncestor.parent.name,
      min: curAncestor.orbit.minRadius,
      max: curAncestor.orbit.maxRadius
    });
  }

  for(let i = ancestors.ancestorPos+1; i < ancestors.body2Ancestors.length; i++) {
    let curAncestor = ancestors.body2Ancestors[i];

    distances.push({
      name: curAncestor.name +'-'+curAncestor.parent.name,
      min: curAncestor.orbit.minRadius,
      max: curAncestor.orbit.maxRadius
    });
  }

  distances.sort((a, b) => {
    return b.min - a.min;
  });

  let largestReduction = 0;

  for( let i = 1; i < distances.length; i++) {
    largestReduction += distances[i].max;
  }

  if(largestReduction > distances[0].min) {
    //I don't think this can happen in a real solar system, so not worrying about writing code to make it work
    console.log(`TODO improve min distance calculation, this pair of systems is not being calculated properly: ${body1.name} - ${body2.name}`);

    return Math.abs(largestReduction - distances[0].min);
  }

  return distances[0].min - largestReduction;
/*
  minDistances1.reverse();
  maxDistances1.reverse();

  const distances = [];

  const minDistances = minDistances1.concat(minDistances2);
  const maxDistances = maxDistances1.concat(maxDistances2);

  //
  console.log('min distances 1: '+minDistances1);
  console.log('max distances 1: '+maxDistances1);
  console.log('min distances 2: '+minDistances2);
  console.log('max distances 2: '+maxDistances2);
  console.log('all min distances: '+minDistances);
  console.log('all max distances: '+maxDistances);
*/


  return SystemBody.getMaxBodyDistance(body1, body2);
}

SystemBody.getAvgBodyDistance = (body1, body2) => {
  return (SystemBody.getMinBodyDistance(body1, body2) + SystemBody.getMaxBodyDistance(body1, body2))/2;
}
