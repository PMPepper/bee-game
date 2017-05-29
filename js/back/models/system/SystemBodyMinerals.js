//represets the minerals present in a system body

import Model from '../Model'
import {SystemBodyMineral} from './SystemBodyMineral'
import {Game} from '../Game'

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

SystemBodyMinerals.createMineralsFor = (systemBody, plentifulness) => {
  const gameConfig = Game.getGameConfig();

  const mineralsObjects = [];

  gameConfig.minerals.forEach((mineralName) => {
    //TODO use plentifulness to determine what minerals this planet has


    const systemBodyTypeMineralModifier = gameConfig.bodyTypeMineralModifiers[systemBody.type] && gameConfig.bodyTypeMineralModifiers[systemBody.type][mineralName] ? gameConfig.bodyTypeMineralModifiers[systemBody.type][mineralName] : 1 ;

    //will be a number between 0 and 1, higher plentifulness will tend towards 1
    let baseBodyMineralDensity = Math.pow(Math.random(), 1/plentifulness);

    //adjust based on body type
    let mineralDensity = gameConfig.baseMineralDensity * baseBodyMineralDensity;

    let amount = Math.round(mineralDensity * systemBody.mass)

    let accesibility = 1;//TODO base accessilbility on surface area/density and plentifulness

    const mineral = new SystemBodyMineral(mineralName, amount, accesibility, amount);
    mineralsObjects.push(mineral);
  })

  return new SystemBodyMinerals(mineralsObjects);
}
