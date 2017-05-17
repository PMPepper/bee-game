export const Constants = {};

Constants.GRAVITATIONAL_CONSTANT = 6.67408e-11;
Constants.STEFAN_BOLTZMANN = 5.670373e-8;

Constants.G = 9.819649737724955;//Earth's surface gravity based on internal calculations (9.819649737724955)

//Time Constants
Constants.DAY = 86400;
Constants.DAYS_PER_YEAR = 365;//ignore leap years
Constants.YEAR = Constants.DAY * Constants.DAYS_PER_YEAR;

Object.freeze(Constants);
