//represets the minerals present in a system body

import {Model} from '../Model'
import {SystemBodyMineral} from './SystemBodyMineral'

export class SystemBodyMinerals extends Model {
  constructor (minerals) {
    super();

    this._minerals = minerals || [];
  }

  getMineralByName(name) {
    const minerals = this.minerals;

    for(let i = 0; i < minerals.length; i++) {
      if(minerals[i].name == nane) {
        return minerals[i];
      }
    }

    return null;
  }

  getState () {
    return this._state({
      mineralIds: this.getObjectState(this._minerals)
    });
  }
}

//Default minerals
//TODO make all this configurable
SystemBodyMinerals.allMinerals = [
  'corbynite',
  'quadlithium',
  'neutronium',
  'kriptinite',
  'meseonite',
  'blairite',
  'selenicite',
  'baryonium',
  'hadronium',
  'thatcherite',
  'leonium',
  'brownite'
];

const bodyTypeMineralModifiers = {
  'gas giant': {//gas giants only have quadlithium, and low density (but their huge size makes up for it)
    corbynite:0,
    quadlithium:0.5,
    neutronium: 0,
    kriptinite: 0,
    meseonite: 0,
    blairite: 0,
    selenicite: 0,
    baryonium: 0,
    hadronium: 0,
    thatcherite: 0,
    leonium: 0,
    brownite: 0
  }
}

const baseMineralDensity = 1/1000000000;

SystemBodyMinerals.createMineralsFor = (systemBody, plentifulness) => {
  const mineralsObjects = [];
  SystemBodyMinerals.allMinerals.forEach((mineralName) => {
    //TODO use plentifulness to determine what minerals this planet has


    const systemBodyTypeMineralModifier = bodyTypeMineralModifiers[systemBody.type] && bodyTypeMineralModifiers[systemBody.type][mineralName] ? bodyTypeMineralModifiers[systemBody.type][mineralName] : 1 ;

    //will be a number between 0 and 1, higher plentifulness will tend towards 1
    let baseBodyMineralDensity = Math.pow(Math.random(), 1/plentifulness);

    //adjust based on body type
    let mineralDensity = baseMineralDensity * baseBodyMineralDensity * baseMineralDensity;

    let amount = Math.round(mineralDensity * systemBody.mass)

    let accesibility = 1;//TODO base accessilbility on surface area/density and plentifulness

    const mineral = new SystemBodyMineral(mineralName, amount, accesibility, amount);
    mineralsObjects.push(mineral);
  })

  return new SystemBodyMinerals(mineralsObjects);
}
