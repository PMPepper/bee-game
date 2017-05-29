export const Constants = {};

//Physical constants
Constants.GRAVITATIONAL_CONSTANT = 6.67408e-11;
Constants.STEFAN_BOLTZMANN = 5.670373e-8;

Constants.G = 9.819649737724955;//Earth's surface gravity based on internal calculations (9.819649737724955)
Constants.C = 299792458;//speed of light (m/s)

//Time Constants
Constants.MINUTE = 60;
Constants.HOUR = 3600;
Constants.DAY = 86400;
Constants.DAYS_PER_YEAR = 365;//ignore leap years
Constants.YEAR = Constants.DAY * Constants.DAYS_PER_YEAR;

//distances
Constants.LIGHT_SECOND =  Constants.C;
Constants.LIGHT_MINUTE =  Constants.C * Constants.MINUTE;
Constants.LIGHT_HOUR =    Constants.C * Constants.HOUR;
Constants.LIGHT_DAY =     Constants.C * Constants.DAY;
Constants.LIGHT_YEAR =    Constants.C * Constants.YEAR;

Object.freeze(Constants);
