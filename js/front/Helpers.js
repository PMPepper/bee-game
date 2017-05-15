const Date = window.Date;

function getDateObj(date) {
  if(!(date instanceof Date)) {
    date = new Date(date*1000);
  }

  return date;
}

export const Helpers = Object.freeze({
  ucFirst:(str) => {
    return str.charAt(0).toUpperCase() + str.substr(1);
  },
  formatNumber:(number) => {
    return number.toLocaleString();
  },
  formatDate(date) {
    if(date == null) {
      return '-';
    }

    date = getDateObj(date);


  },
  formatTime(date) {
    if(date == null) {
      return '-';
    }

    date = getDateObj(date);

  },
  formatDateTime(date) {
    if(date == null) {
      return '-';
    }

    date = getDateObj(date);

  }
})
