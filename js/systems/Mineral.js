export class Mineral {
  constructor (initialAmount, initialAccessibility, currentAmount) {
    this._initialAmount = initialAmount;
    this._initialAccessibility = initialAccessibility;
    this._currentAmount = currentAmount;
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
    //TODO
    return this.initialAccessibility;
  }
}
