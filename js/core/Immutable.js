export class Immutable {
  _freeze (constr) {
    if(new.target == constr) {
      Object.freeze(this);
    }
  }
}
