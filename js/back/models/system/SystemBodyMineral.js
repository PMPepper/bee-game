//represents the amount of a specific mineral present on a system body

import Model from '../Model'

export class SystemBodyMineral extends Model {
  constructor (name, initialAmount, initialAccessibility, currentAmount) {
    super();

    this._name = name;
    this._initialAmount = initialAmount;
    this._initialAccessibility = initialAccessibility;
    this._currentAmount = currentAmount;
  }

  get name() {
    return this._name;
  }

  get initialAmount () {
    return this._initialAmount;
  }

  get initialAccessibility () {
    return this._initialAccessibility;
  }

  get currentAmount () {
    return this._currentAmount;
  }

  set currentAmount (newCurrentAmount) {
    this._currentAmount = newCurrentAmount;
  }

  get currentAccessibility () {
    //TODO adjust this towards 0 as the mineral nears depletion
    return this.initialAccessibility;
  }

  getState() {
    return this._state({
      name: this.name,
      amount: this.currentAmount,
      accessibility: this.currentAccessibility
    })
  }
}
