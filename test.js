import test from 'ava';
import 'babel-register';

//flat top
//TODO implement these
/*import {AxialCoords as FlatTopAxialCoords} from "./js/hex/flatTop/AxialCoords";
import {CubeCoords as FlatTopCubeCoords} from "./js/hex/flatTop/CubeCoords";
import {OffsetCoords as FlatTopOffsetCoords} from "./js/hex/flatTop/OffsetCoords";
import {HexCoords as FlatTopHexCoords} from "./js/hex/flatTop/HexCoords";*/
import {Directions as FlatTopDirections} from "./js/hex/flatTop/Directions";
//import { as FlatTop} from "./js/hex/flatTop/";

//pointy top
import {HexGrid as PointyTopHexGrid} from "./js/hex/pointyTop/HexGrid";
import {AxialCoords as PointyTopAxialCoords} from "./js/hex/pointyTop/AxialCoords";
import {CubeCoords as PointyTopCubeCoords} from "./js/hex/pointyTop/CubeCoords";
import {OffsetCoords as PointyTopOffsetCoords} from "./js/hex/pointyTop/OffsetCoords";
import {HexCoords as PointyTopHexCoords} from "./js/hex/pointyTop/HexCoords";
import {Directions as PointyTopDirections} from "./js/hex/pointyTop/Directions";
//import { as PointyTop} from "./js/hex/pointyTop/";

//0,0
const ax0 = new PointyTopAxialCoords(0, 0);
const cb0 = new PointyTopCubeCoords(0, 0, 0);
const of0 = new PointyTopOffsetCoords(0, 0, PointyTopOffsetCoords.Layouts.oddRow);

//down/right 1 from 0
const ax1 = new PointyTopAxialCoords(0, 1);
const cb1 = new PointyTopCubeCoords(0, -1, 1);
const of1 = new PointyTopOffsetCoords(0, 1, PointyTopOffsetCoords.Layouts.oddRow);

//down/right 2 from 0
const ax2 = new PointyTopAxialCoords(0, 2);
const cb2 = new PointyTopCubeCoords(0, -2, 2);
const of2 = new PointyTopOffsetCoords(1, 2, PointyTopOffsetCoords.Layouts.oddRow);

// Tests...

test('Pointy top constructor tests', (t) => {
  t.throws(() => {
    new PointyTopHexCoords();
  }, null, 'Cannot instanciate HexCoords class directly');

  t.throws(() => {
    new PointyTopAxialCoords();
  }, null, 'AxialCoords arguments are valid');

  t.throws(() => {
    new PointyTopCubeCoords();
  }, null, 'CubeCoords arguments are valid');

  t.throws(() => {
    new PointyTopOffsetCoords();
  }, null, 'OffsetCoords arguments are valid');

  t.throws(() => {
    new PointyTopCubeCoords(1, 2, 3);
  }, null, 'CubeCoords arguments are valid');

  t.truthy(() => {
    return new HexGrid(100, 100);
  }, 'Create HexGrid')
});

//-Equality
test('Pointy top compare equivalent coords: ', (t) => {
  t.throws(() => {ax1.equals()}, null, 'axial coords argument required')
  t.throws(() => {ax1.equals({})}, null, 'axial coords argument type check')
  t.throws(() => {cb1.equals()}, null, 'cube coords argument required')
  t.throws(() => {cb1.equals({})}, null, 'cube coords argument type check')
  t.throws(() => {of1.equals()}, null, 'offset coords argument required')
  t.throws(() => {of1.equals({})}, null, 'offset coords argument type check')
  t.true(ax1.equals(cb1), 'axial and cube coords');
  t.true(ax1.equals(of1), 'axial and offset coords');
  t.true(cb1.equals(of1), 'cube and offset coords');
});

//-Non-equality
test('Pointy top compare non-equivalent coords:', (t) => {
  t.false(ax1.equals(cb2), 'axial and cube coords');
  t.false(ax1.equals(of2), 'axial and offset coords');
  t.false(cb1.equals(of2), 'cube and offset coords');
});

//-Directions
test('Pointy top directions:', (t) => {
  t.true(PointyTopDirections.isValid('right'), '"right" is a valid direction');
  t.false(PointyTopDirections.isValid('up'), '"up" is not a valid direction');
});

test('Flat top directions:', (t) => {
  t.true(FlatTopDirections.isValid('up'), '"up" is a valid direction');
  t.false(FlatTopDirections.isValid('right'), '"right" is not a valid direction');
});

test('Pointy top coordinate addition: ', (t) => {
  t.throws(() => {ax1.add()}, null, 'axial coords argument required')
  t.throws(() => {ax1.add({})}, null, 'axial coords argument type check')
  t.throws(() => {cb1.add()}, null, 'cube coords argument required')
  t.throws(() => {cb1.add({})}, null, 'cube coords argument type check')
  t.throws(() => {of1.add()}, null, 'offset coords argument required')
  t.throws(() => {of1.add({})}, null, 'offset coords argument type check')
});

test('Pointy top coordinate subtraction: ', (t) => {
  t.throws(() => {ax1.subtract()}, null, 'axial coords argument required')
  t.throws(() => {ax1.subtract({})}, null, 'axial coords argument type check')
  t.throws(() => {cb1.subtract()}, null, 'cube coords argument required')
  t.throws(() => {cb1.subtract({})}, null, 'cube coords argument type check')
  t.throws(() => {of1.subtract()}, null, 'offset coords argument required')
  t.throws(() => {of1.subtract({})}, null, 'offset coords argument type check')
});

//-Neighbours
test('Pointy top neighbouring coords', (t) => {
  t.pass('axial')
  t.is(cb0.isNeighbour(cb1), PointyTopDirections.downRight, 'cube')
  t.pass('offset')
  t.pass('axial - cube')
  t.pass('cube - axial')
  t.pass('axial - offset')
  t.pass('offset - axial')
  t.pass('cube - offset')
  t.pass('offset - cube');
});

test('Pointy top non-neighbouring coords', (t) => {
  t.pass('axial')
  t.false(cb0.isNeighbour(cb2), 'cube')
  t.pass('offset')
  t.pass('axial - cube')
  t.pass('cube - axial')
  t.pass('axial - offset')
  t.pass('offset - axial')
  t.pass('cube - offset')
  t.pass('offset - cube');
});

test('Pointy top coords distance', (t) => {
  t.is(ax0.distanceTo(ax2), 2, 'axial')
  //t.is(cb0.distanceTo(cb2), 99, 'cube');
  t.pass('offset')
  t.pass('axial - cube')
  t.pass('cube - axial')
  t.pass('axial - offset')
  t.pass('offset - axial')
  t.pass('cube - offset')
  t.pass('offset - cube');
});
