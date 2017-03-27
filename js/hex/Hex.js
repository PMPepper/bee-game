import {AxialCoords} from "./AxialCoords";
import {CubeCoords} from "./CubeCoords";
import {OffsetCoords} from "./OffsetCoords";

console.log(AxialCoords);

console.log(new AxialCoords(1, 2).toString());
console.log(new CubeCoords(1, 2, 3).toString());
console.log(new OffsetCoords(1, 2).toString());

function test1() {
  const ax = new AxialCoords(0, 1);
  const cb = new CubeCoords(0, -1, 1);
  const cb2 = new CubeCoords(0, -1, 2);

  console.log(`${ax} equals ${cb}: `, ax.equals(cb));
  console.log(`${ax} equals ${cb2}: `, ax.equals(cb2));
}

test1();
