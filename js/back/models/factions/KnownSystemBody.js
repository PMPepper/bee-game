import Model from '../Model';

export class KnownSystemBody extends Model {
  constructor(systemBody, name, isSurveyed) {
    super();

    this._systemBody = systemBody;
    this._name = name;
    this._isSurveyed = isSurveyed;
  }

  get systemBody() {
    return this._systemBody;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get isSurveyed() {
    return this._isSurveyed;
  }

  set isSurveyed(value) {
    this._isSurveyed = value;
  }

  getState() {
    return this._state({
      name: this.name,
      systemBodyId: Model.id(this.systemBody),
      isSurveyed: this.isSurveyed,
      mineralsId: this.isSurveyed ? Model.id(this.systemBody.minerals) : null
    });
  }
}
