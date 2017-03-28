import {DataPool} from "../../DataPool";
import {HexCoords} from "./HexCoords";
import {HexCoordOffset} from "./HexCoordOffset";

let inited = false;





function init() {
  if(inited) {
    return;
  }

  delete DataPools.init;

  inited = true;
  const coordsPool = new DataPool(HexCoords, 100);
  const coordOffsetPool = new DataPool(HexCoordOffset, 20);

  DataPools.coordsPool = coordsPool;
  DataPools.coordOffsetPool = coordOffsetPool;

  Object.freeze(DataPools);
};

export const DataPools = {init:init};
