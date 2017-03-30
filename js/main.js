import {RenderHexCanvas} from "./hex/pointyTop/RenderHexCanvas";
import {HexGrid} from "./hex/pointyTop/HexGrid";

import {CustomHexRenderer} from "./game/CustomHexRenderer";
const $ = require('./../bower_components/jquery/dist/jquery');

$(() => {
  const grid = HexGrid.createRectangle(10, 10);
  const $canvas = $('#canvas');
  const $output = $('#output');
  const renderer = new RenderHexCanvas($canvas[0], grid);

  grid.forEach((hex) => {
    hex.modules['render-content-2d'] = new CustomHexRenderer(hex, '#333', 'rgb(200,200,255)', '#000');
  });

  let cameraX = 20;
  let cameraY = 20;

  function step(timestamp) {
    renderer.render(cameraX, cameraY);

    if(lineStart && lineEnd) {
      let ctx = $canvas[0].getContext('2d');

      ctx.lineStyle = '#4a7';
      ctx.beginPath();
      ctx.moveTo(cameraX + (lineStart.x2d * hexSize), cameraY + (lineStart.y2d * hexSize));
      ctx.lineTo(cameraX + (lineEnd.x2d * hexSize), cameraY + (lineEnd.y2d * hexSize));
      ctx.stroke();
    }

    window.requestAnimationFrame(step);
  }

  let lastHex = null;
  let hexSize = 16;

  $canvas.on('mousemove', (e)=>{
    let coord = HexGrid.HexCoords.from2dCoords(e.offsetX - cameraX, e.offsetY - cameraY, hexSize);

    let hex = grid.getHexAt(coord);

    if(hex) {
      hex.modules['render-content-2d'].fillStyle = '#F66';
    }

    if(lastHex && lastHex != hex) {
      lastHex.modules['render-content-2d'].fillStyle = 'rgb(200,200,255)';
    }

    lastHex = hex;

    coord.release();
  });

  let lineStart = null;
  let lineEnd = null;
  let lineHexes = null;

  $canvas.on('click', (e) => {
    let coord = HexGrid.HexCoords.from2dCoords(e.offsetX - cameraX, e.offsetY - cameraY, hexSize);

    let hex = grid.getHexAt(coord);

    coord.release();

    if(hex) {
      hex.modules['render-content-2d'].fillStyle = '#F66';

      if(lineStart){
        if(lineEnd) {
          //reset
          lineStart = hex;
          lineEnd = null;

          lineHexes.forEach((hex) => {
            if(hex) {
              hex.modules['render-content-2d'].fillStyle = 'rgb(200,200,255)';
            }

            $output.text('');
          });

          lineHexes = null;
        } else {
          lineEnd = hex;

          lineHexes = grid.lineTo(lineStart, lineEnd);

          if( lineHexes && lineHexes.length > 0) {
            lineHexes.forEach((hex) => {

              hex.modules['render-content-2d'].fillStyle = '#6F6';
            });

            $output.text(lineStart.distanceTo(lineEnd).toString());
          } else {
            lineStart = lineEnd = null;
          }

        }
      } else {
        lineStart = hex;
      }
    }
  });

  window.requestAnimationFrame(step);
});


$(() => {
  const grid = HexGrid.createRectangle(20, 20);
  const $canvas = $('#distance');
  const renderer = new RenderHexCanvas($canvas[0], grid);

  let cameraX = 20;
  let cameraY = 20;
  let hexSize = 16;

  renderer.hexSize = hexSize;

  //Init custom renderer
  grid.forEach((hex) => {
    hex.modules['render-content-2d'] = new CustomHexRenderer(hex, '#333', 'rgb(200,200,255)', '#000');
  });

  function step(timestamp) {
    renderer.render(cameraX, cameraY);

    window.requestAnimationFrame(step);
  }

  let center = null;

  $canvas.on('click', (e) => {
    let coord = HexGrid.HexCoords.from2dCoords(e.offsetX - cameraX, e.offsetY - cameraY, hexSize);

    center = grid.getHexAt(coord);

    coord.release();
  });

  let rangeHexes = null;

  $canvas.on('mousemove', (e) => {
    if(!center) {
      return;
    }

    let coord = HexGrid.HexCoords.from2dCoords(e.offsetX - cameraX, e.offsetY - cameraY, hexSize);

    let hexAtMouse = grid.getHexAt(coord);

    coord.release();

    if(!hexAtMouse) {// || hexAtMouse == center
      return;
    }

    let distance = center.distanceTo(hexAtMouse);

    let hexesInRange = center.hexesInRange(distance);

    if(rangeHexes) {
      paintHexes(rangeHexes, 'rgb(200,200,255)');
    }

    paintHexes(hexesInRange, '#f99');

    rangeHexes = hexesInRange;
  });

  step();
});


$(() => {
  const grid = HexGrid.createHexagon(6, 0, 0);
  const $canvas = $('#rotate');
  const renderer = new RenderHexCanvas($canvas[0], grid);

  let cameraX = 200;
  let cameraY = 160;
  let hexSize = 16;

  renderer.hexSize = hexSize;

  let changedHexes = [];

  //Init custom renderer
  grid.forEach((hex) => {
    hex.modules[renderer.customRendererModuleName] = new CustomHexRenderer(hex, '#333', 'rgb(200,200,255)', '#000');
  });


  let center = grid.getHexAt(0, 0);
  center.modules[renderer.customRendererModuleName].fillStyle = 'rgb(255,255,255)';


  function step(timestamp) {
    renderer.render(cameraX, cameraY);

    window.requestAnimationFrame(step);
  }

  $canvas.on('mousemove', (e) => {
    //reset styles
    changedHexes.forEach((hex) => {
      hex.modules[renderer.customRendererModuleName].fillStyle = 'rgb(200,200,255)';
    });

    changedHexes.length = 0;

    center.modules[renderer.customRendererModuleName].fillStyle = 'rgb(255,255,255)';

    let coord = HexGrid.HexCoords.from2dCoords(e.offsetX - cameraX, e.offsetY - cameraY, hexSize);

    let initial = grid.getHexAt(coord);

    if(initial) {
      changedHexes.push(initial);

      for(let i = 1; i <= 6; i++) {
        let rotatedCoord = initial.rotateStep(i);

        let rotatedHex = grid.getHexAt(rotatedCoord);

        if(rotatedHex) {
          rotatedHex.modules[renderer.customRendererModuleName].fillStyle = 'rgb(200,'+Math.ceil(220 + ((35 / 6) * i))+',200)';
          changedHexes.push(rotatedHex);
        }

        rotatedCoord.release();
      }
    }

    coord.release();
  });

  step();
});

















function paintHexes(hexes, fillColour) {
  hexes.forEach((hex) => {
    hex.modules['render-content-2d'].fillStyle = fillColour;
  });
}

/*


function cube_round(h) {
  var rx = Math.round(h.x)
  var ry = Math.round(h.y)
  var rz = Math.round(h.z)

  var x_diff = Math.abs(rx - h.x)
  var y_diff = Math.abs(ry - h.y)
  var z_diff = Math.abs(rz - h.z)

  if( x_diff > y_diff and x_diff > z_diff ) {
      rx = -ry-rz
  } else if (y_diff > z_diff) {
      ry = -rx-rz
  } else {
      rz = -rx-ry
  }
  return Cube(rx, ry, rz)
}

function hex_round(h) {
  return cube_to_hex(cube_round(hex_to_cube(h)));
}*/


/*

class Test {
  constructor(...args) {
    this.args = args;
  }

  * [Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }
    }

    *_iterate() {
      yield 'w';
      yield 't';
      yield 'f';
    }

    get iterate() {
      return this._iterate();
    }
}

let t1 = new Test(1, 2, 3, 'a', 'b', 'c');

for (let x of t1) {
    console.log(x);
}

for (let x of t1._iterate()) {
    console.log(x);
}

console.log('');
console.log('Iterate test yields: ');

for (let x of t1.iterate) {
    console.log(x);
}

console.log('');

*/
