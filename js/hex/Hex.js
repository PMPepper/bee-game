import {HexGrid} from "./pointyTop/HexGrid";


//TODO prevent repeated objects being generated for the same coordinate? Link coordinate object to grid? Hmmm....


function test1() {
  /*const ax = new AxialCoords(0, 1);
  const cb = new CubeCoords(0, -1, 1);
  const cb2 = new CubeCoords(0, -1, 2);

  console.log(`${ax} equals ${cb}: `, ax.equals(cb));
  console.log(`${ax} equals ${cb2}: `, ax.equals(cb2));*/

  const hexGrid = HexGrid.createRectangle(100, 100);

  //0,0
  const ptc0 = new hexGrid.getCoordAt(0, 0);

  //down/right 1 from 0
  const ptc1 = new hexGrid.getCoordAt(0, 1);

  //down/right 2 from 0
  const ptc2 = new hexGrid.getCoordAt(0, 2);

  ptc1.add(ptc1).equals(ptc2);

  console.log(hexGrid._data);

  console.log(ptc0, ptc1, ptc2);
}

test1();
