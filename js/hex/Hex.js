import {HexGrid} from "./pointyTop/HexGrid";


//TODO prevent repeated objects being generated for the same coordinate? Link coordinate object to grid? Hmmm....


function test1() {

  const hexGrid = HexGrid.createRectangle(10, 10);

  //0,0
  const ptc0 = new hexGrid.getCoordAt(0, 0);

  //down/right 1 from 0
  const ptc1 = new hexGrid.getCoordAt(0, 1);

  //down/right 2 from 0
  const ptc2 = new hexGrid.getCoordAt(0, 2);

  ptc1.add(ptc1).equals(ptc2);
}

test1();
