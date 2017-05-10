//represets a stockpile of minerals

//TODO implement

import {Model} from './Model'
import {SystemBodyMineral} from './SystemBodyMineral'

export class SystemBodyMinerals extends Model {
  constructor (
      corbynite,
      quadlithium,
      neutronium,
      kriptinite,
      meseonite,
      blairite,
      selenicite,
      baryonium,
      hadronium,
      thatcherite,
      leonium,
      brownite
  ) {
    super();

    this._corbynite = corbynite;
    this._quadlithium = quadlithium;
    this._neutronium = neutronium;
    this._kriptinite = kriptinite;
    this._meseonite = meseonite;
    this._blairite = blairite;
    this._selenicite = selenicite;
    this._baryonium = baryonium;
    this._hadronium = hadronium;
    this._thatcherite = thatcherite;
    this._leonium = leonium;
    this._brownite = brownite;
  }

  get corbynite() {
    return this._corbynite;
  }

  get quadlithium() {
    return this._quadlithium;
  }

  get neutronium() {
    return this._neutronium;
  }

  get kriptinite() {
    return this._kriptinite;
  }

  get meseonite() {
    return this._meseonite;
  }

  get blairite() {
    return this._blairite;
  }

  get selenicite() {
    return this._selenicite;
  }

  get baryonium() {
    return this._baryonium;
  }

  get hadronium() {
    return this._hadronium;
  }

  get thatcherite() {
    return this._thatcherite;
  }

  get leonium() {
    return this._leonium;
  }

  get brownite() {
    return this._brownite;
  }

  getState () {
    return this._state({
      corbyniteId:    Model.id(this._corbynite),
      quadlithiumId:  Model.id(this._quadlithium),
      neutroniumId:   Model.id(this._neutronium),
      kriptiniteId:   Model.id(this._kriptinite),
      meseoniteId:    Model.id(this._meseonite),
      blairiteId:     Model.id(this._blairite),
      seleniciteId:   Model.id(this._selenicite),
      baryoniumId:    Model.id(this._baryonium),
      hadroniumId:    Model.id(this._hadronium),
      thatcheriteId:  Model.id(this._thatcherite),
      leoniumId:      Model.id(this._leonium),
      browniteId:     Model.id(this._brownite)
    });
  }
}

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

    const mineral = new SystemBodyMineral(amount, accesibility, amount);
    mineralsObjects.push(mineral);
  })

  //debugger;
  return new (Function.prototype.bind.apply(SystemBodyMinerals, mineralsObjects));
}
