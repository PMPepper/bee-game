import {Coord} from '../Coord';
import {Constants} from '../Constants';

export class SystemBody {
  constructor (name, mass, radius, parent, orbit) {
    this._name = name;
    this._mass = mass;
    this._radius = radius;
    this._parent = parent || null;
    this._orbit = orbit;
    this._system = null;

    if(orbit) {
      orbit._body = this;
    }
  }

  get name () {
    return this._name;
  }

  get mass () {
    return this._mass;
  }

  get radius () {
    return this._radius;
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

  let commonAncestorDepth1 = 0;
  let commonAncestorDepth2 = 0;

  body1Ancestors.unshift(body1);
  body2Ancestors.unshift(body2);

  body1Ancestors.reverse();
  body2Ancestors.reverse();

  const minLength = Math.min(body1Ancestors.length, body2Ancestors.length);

  //find first common orbit

  let i = 0;

  for( i = 0; i < minLength; i++) {
    if(body2Ancestors[i] != body2Ancestors[i]) {
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

  //TODO work out the closest possible arrangement

  //get list of distances
  /*const distances1 = [];
  const distances2 = [];

  for(i = ancestorPos+1; i < body1Ancestors.length; i++) {
    distances1.push(body1Ancestors[i].orbitRadius);
  }

  for(i = ancestorPos+1; i < body2Ancestors.length; i++) {
    distances2.push(body2Ancestors[i].orbitRadius);
  }

  console.log(distances1);
  console.log(distances2);*/

  return SystemBody.getMaxBodyDistance(body1, body2);
}

SystemBody.getAvgBodyDistance = (body1, body2) => {
  return (SystemBody.getMinBodyDistance(body1, body2) + SystemBody.getMaxBodyDistance(body1, body2))/2;
}
