function isNumber(val) {
  val = +val;

  return val === val && isFinite(val);
}

export const VarHelpers = {
  isNumber: isNumber
}

Object.freeze(VarHelpers);
