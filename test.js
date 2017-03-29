import test from 'ava';
import 'babel-register';
import 'babel-polyfill';

//flat top
//TODO implement these
//pointy top
import {HexGrid as PointyTopHexGrid} from "./js/hex/pointyTop/HexGrid";
//import { as PointyTop} from "./js/hex/pointyTop/";

const pointyTopHexGrid = PointyTopHexGrid.createRectangle(10, 10);

//0,0
const ptc0 = pointyTopHexGrid.getHexAt(0, 0);

//down/right 1 from 0
const ptc1 = pointyTopHexGrid.getHexAt(0, 1);

//down/right 2 from 0
const ptc2 = pointyTopHexGrid.getHexAt(0, 2);

// Tests...

test('Pointy top constructor tests', (t) => {

  t.throws(() => {
    new PointyTopHexGrid.HexCoords();
  }, null, 'HexCoords empty constructor');

  t.throws(() => {
    new PointyTopHexGrid();
  }, null, 'HexGrid empty constructor');

  t.throws(() => {
    new PointyTopHexGrid( 3, 'b');
  }, null, 'HexGrid invalid constructor');

  t.truthy(() => {
    return PointyTopHexGrid.createRectangle(10, 10);
  }, 'Create HexGrid')
});

//-Equality
test('Pointy top compare equivalent coords: ', (t) => {
  t.false(ptc0.equals(ptc1), 'coords not equivalent');
  t.true(ptc2.equals(ptc2), 'coords are equivalent');
});

//-Directions
test('Pointy top directions:', (t) => {
  t.true(PointyTopHexGrid.Directions.isValid('right'), '"right" is a valid direction');
  t.false(PointyTopHexGrid.Directions.isValid('up'), '"up" is not a valid direction');
});

/*test('Flat top directions:', (t) => {
  t.true(FlatTopDirections.isValid('up'), '"up" is a valid direction');
  t.false(FlatTopDirections.isValid('right'), '"right" is not a valid direction');
});*/

test('Pointy top coordinate addition: ', (t) => {
  t.throws(() => {ptc0.add()}, null, 'coords addition argument required');
  t.throws(() => {ptc0.add({})}, null, 'coords addition argument type check');

  t.true(ptc1.add(ptc1).equals(ptc2), 'coords addition check');
});

test('Pointy top coordinate subtraction: ', (t) => {
  t.throws(() => {ptc0.subtract()}, null, 'coords subtraction argument required');
  t.throws(() => {ptc0.subtract({})}, null, 'coords subtraction argument type check');

  t.true(ptc1.subtract(ptc1).equals(ptc0), 'coords subtraction check');
});

//-Neighbours
test('Pointy top neighbouring coords', (t) => {
  t.is(ptc0.isNeighbour(ptc1), PointyTopHexGrid.Directions.downRight, 'is neighbour down right');
});

test('Pointy top non-neighbouring coords', (t) => {
  t.false(ptc0.isNeighbour(ptc2), 'is not neighbour');
});

test('Pointy top coords distance', (t) => {
  t.is(ptc0.distanceTo(ptc2), 2, 'coords distance');
});
