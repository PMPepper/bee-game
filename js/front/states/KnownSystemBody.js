import {State} from './State';
import {SubStellarBody} from './system/SubStellarBody';

export class KnownSystemBody extends State {
  constructor(id, systemBody, name, isSurveyed, minerals) {
    super(id);

    this._systemBody = systemBody;
    this._name = name;
    this._isSurveyed = isSurveyed;
    this._minerals = minerals;
    this._knownSystem = null;
    this._colony = null;
    this._knownColonies = {};
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }

  get isSurveyed() {
    return this._isSurveyed;
  }

  get minerals() {
    return this._minerals;
  }

  get knownSystem() {
    return this._knownSystem;
  }

  get colony() {
    return this._colony;
  }

  get knownColonies() {
    return this._knownColonies;
  }

  get isColonisable() {
    return this.systemBody.body instanceof SubStellarBody
  }

  getKnownColonyByFactionId(factionId) {
    return this._knownColonies[factionId] || null;
  }
}
