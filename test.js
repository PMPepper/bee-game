import test from 'ava';
import 'babel-register';

import {HexCoords} from "./js/hex/HexCoords";
import {AxialCoords} from "./js/hex/AxialCoords";
import {CubeCoords} from "./js/hex/CubeCoords";
import {OffsetCoords} from "./js/hex/OffsetCoords";

//0,0
const ax0 = new AxialCoords(0, 0);
const cb0 = new CubeCoords(0, 0, 0);
const of0 = new OffsetCoords(0, 0);

//down/right 1 from 0
const ax1 = new AxialCoords(0, 1);
const cb1 = new CubeCoords(0, -1, 1);
const of1 = new OffsetCoords(0,1);

//down/right 2 from 0
const ax2 = new AxialCoords(0, 2);
const cb2 = new CubeCoords(0, -2, 2);
const of2 = new OffsetCoords(1,2);

// Tests...
test('Constructor tests', (t) => {
  t.throws(() => {
    new HexCoords();
  }, null, 'Cannot instanciate HexCoords class directly');

  t.throws(() => {
    new AxialCoords();
  }, null, 'AxialCoords arguments are valid');

  t.throws(() => {
    new CubeCoords();
  }, null, 'CubeCoords arguments are valid');

  t.throws(() => {
    new OffsetCoords();
  }, null, 'OffsetCoords arguments are valid');

  t.throws(() => {
    new CubeCoords(1, 2, 3);
  }, null, 'CubeCoords arguments are valid');
});

//-Equality
test('Compare equivalent coords: ', (t) => {
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
test('Compare non-equivalent coords:', (t) => {
  t.false(ax1.equals(cb2), 'axial and cube coords');
  t.false(ax1.equals(of2), 'axial and offset coords');
  t.false(cb1.equals(of2), 'cube and offset coords');
});

//-Directions
test('Directions:', (t) => {
  t.true(HexCoords.isDirection(HexCoords.Orientations.pointyTop, HexCoords.getDirections(HexCoords.Orientations.pointyTop).right), `is "${HexCoords.getDirections(HexCoords.Orientations.pointyTop).right}" a direction in orientation "${HexCoords.Orientations.pointyTop}"`);
  t.true(HexCoords.isDirection(HexCoords.Orientations.flatTop, HexCoords.getDirections(HexCoords.Orientations.flatTop).down), `is "${HexCoords.getDirections(HexCoords.Orientations.flatTop).down}" a direction in orientation "${HexCoords.Orientations.flatTop}"`);
  t.false(HexCoords.isDirection(HexCoords.Orientations.flatTop, HexCoords.getDirections(HexCoords.Orientations.pointyTop).right), `is "${HexCoords.getDirections(HexCoords.Orientations.pointyTop).right}" a direction in orientation "${HexCoords.Orientations.pointyTop}"`);
  t.false(HexCoords.isDirection(HexCoords.Orientations.pointyTop, HexCoords.getDirections(HexCoords.Orientations.flatTop).down), `is "${HexCoords.getDirections(HexCoords.Orientations.flatTop).down}" a direction in orientation "${HexCoords.Orientations.flatTop}"`);
  t.false(HexCoords.isDirection(HexCoords.Orientations.pointyTop, 'flibble'), `is "flibble" a direction`);
});

test('Coordinate addition: ', (t) => {
  t.throws(() => {ax1.add()}, null, 'axial coords argument required')
  t.throws(() => {ax1.add({})}, null, 'axial coords argument type check')
  t.throws(() => {cb1.add()}, null, 'cube coords argument required')
  t.throws(() => {cb1.add({})}, null, 'cube coords argument type check')
  t.throws(() => {of1.add()}, null, 'offset coords argument required')
  t.throws(() => {of1.add({})}, null, 'offset coords argument type check')
});

test('Coordinate subtraction: ', (t) => {
  t.throws(() => {ax1.subtract()}, null, 'axial coords argument required')
  t.throws(() => {ax1.subtract({})}, null, 'axial coords argument type check')
  t.throws(() => {cb1.subtract()}, null, 'cube coords argument required')
  t.throws(() => {cb1.subtract({})}, null, 'cube coords argument type check')
  t.throws(() => {of1.subtract()}, null, 'offset coords argument required')
  t.throws(() => {of1.subtract({})}, null, 'offset coords argument type check')
});

//-Neighbours
test('Neighbouring coords', (t) => {
  t.pass('axial')
  t.is(cb0.isNeighbour(cb1), HexCoords.getDirections(HexCoords.Orientations.pointyTop).downRight, 'cube')
  t.pass('offset')
  t.pass('axial - cube')
  t.pass('cube - axial')
  t.pass('axial - offset')
  t.pass('offset - axial')
  t.pass('cube - offset')
  t.pass('offset - cube');
});

test('Non-neighbouring coords', (t) => {
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
