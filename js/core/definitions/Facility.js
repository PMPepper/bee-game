export default class Facility {
  constructor({name, size, sectionSize, workforce, minerals, cost, maintenance, functions, requirements}) {
    this._name = name;
    this._size = size;
    this._sectionSize = sectionSize;
    this._workforce = workforce;
    this._minerals = minerals;
    this._cost = cost;
    this._maintenance = maintenance;
    this._functions = functions;
    this._requirements = requirements;
  }

  get name() {
    return this._name;
  }

  get size() {
    return this._size;
  }

  get sectionSize() {
    return this._sectionSize;
  }

  get workforce() {
    return this._workforce;
  }

  get minerals() {
    return this._minerals;
  }

  get cost() {
    return this._cost;
  }

  get maintenance() {
    return this._maintenance;
  }

  get functions() {
    return this._functions;
  }

  get requirements() {
    return this._requirements;
  }

  getState() {
    return {
      "class": this.constructor.name,
      name: this.name,
      size: this.size,
      sectionSize: this.sectionSize,
      workforce: this.workforce,
      minerals: Object.assign({}, this.minerals),
      cost: this.cost,
      maintenance: this.maintenance,
      functions: Object.assign({}, this.functions),
      requirements: Object.assign({}, this.requirements)
    };
  }
}

Facility.fromObj = (obj) => {
  const classDefinition = require('./'+obj['class']);

  console.log(obj, classDefinition);
};
