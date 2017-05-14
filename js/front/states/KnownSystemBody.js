import {State} from './State';
import {SubStellarBody} from './system/SubStellarBody';

export class KnownSystemBody extends State {
  constructor(id, systemBody, name, minerals) {
    super(id);

    this._systemBody = systemBody;
    this._name = name;
    this._minerals = minerals;
    this._knownSystem = null;
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }

  get minerals() {
    return this._minerals;
  }

  get knownSystem() {
    return this._knownSystem;
  }

  get isColonisable() {
    return this.systemBody.body instanceof SubStellarBody
  }
}
