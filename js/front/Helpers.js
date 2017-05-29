import {Constants} from '../core/Constants';

const Date = window.Date;

function getDateObj(date) {
  if(!(date instanceof Date)) {
    date = new Date(date*1000);
  }

  return date;
}

export function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export function formatNumber(number) {
  return number.toLocaleString();
}

export function formatDate(date) {
  if(date == null) {
    return '-';
  }

  date = getDateObj(date);
}

export function formatTime(date) {
  if(date == null) {
    return '-';
  }

  date = getDateObj(date);

}

export function formatDateTime(date) {
  if(date == null) {
    return '-';
  }

  date = getDateObj(date);

}

const distanceMagnitudes = ['m', 'km', 'Mm', 'Gm', 'Tm', 'Pm', 'Em', 'Zm', 'Ym'];

export function roundTo(num, dps) {
  const pow = Math.pow(10, dps);

  return Math.round(num * pow) / pow;
}

export function ceilTo(num, dps) {
  const pow = Math.pow(10, dps);

  return Math.ceil(num * pow) / pow;
}

export function floorTo(num, dps) {
  const pow = Math.pow(10, dps);

  return Math.floor(num * pow) / pow;
}

export function formatDistanceSI(distance, maxDP) {
  const pow = Math.floor(Math.log10(distance));
  const mag = Math.floor(pow / 3);

  let magDist = distance / Math.pow(10, mag*3);

  return roundTo(magDist, maxDP) + ' ' + distanceMagnitudes[mag];
}



//TODO
export function formatDistanceC(distance, maxDP) {
  return '';

  const pow = Math.ceil(Math.log10(distance));
  const mag = Math.floor(pow / 3);

  let magDist = distance / Math.pow(10, mag*3);
  console.log(pow);

  return roundTo(magDist, maxDP) + ' ' + distanceMagnitudes[mag];
}

export function metersToLightSeconds(m) {
  //2.998e+8
  return m / Constants.LIGHT_SECOND;
}

export function metersToLightMinutes(m) {
  //1.799e+10
  return m / Constants.LIGHT_MINUTE;
}

export function metersToLightHours(m) {
  //1.799e+10
  return m / Constants.LIGHT_HOUR;
}

export function metersToLightDays(m) {
  //2.59e+13
  return m / Constants.LIGHT_DAY;
}

export function metersToLightYears(m) {
  //9.4605284e+15
  return m / Constants.LIGHT_YEAR;
}
