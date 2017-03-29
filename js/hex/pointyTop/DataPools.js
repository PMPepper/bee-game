import {DataPool} from "../../DataPool";
import {KeyValuePair} from "../../KeyValuePair";
import {HexCoords} from "./HexCoords";
import {Hex} from "./Hex";

let inited = false;





function init() {
  if(inited) {
    return;
  }

  delete DataPools.init;

  inited = true;
  const keyValuesPool = new DataPool(KeyValuePair, 100);
  const coordsPool = new DataPool(HexCoords, 100);
  const hexPool = new DataPool(Hex, 100);

  DataPools.keyValuesPool = keyValuesPool;
  DataPools.coordsPool = coordsPool;
  DataPools.hexPool = hexPool;

  Object.freeze(DataPools);
};

export const DataPools = {init:init};
