//represets a stockpile of minerals

//TODO implement

import {Model} from './Model'

export class MineralsStockpile extends Model {
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
      corbynite: this._corbynite,
      quadlithium: this._quadlithium,
      neutronium: this._neutronium,
      kriptinite: this._kriptinite,
      meseonite: this._meseonite,
      blairite: this._blairite,
      selenicite: this._selenicite,
      baryonium: this._baryonium,
      hadronium: this._hadronium,
      thatcherite: this._thatcherite,
      leonium: this._leonium,
      brownite: this._brownite
    });
  }
}
