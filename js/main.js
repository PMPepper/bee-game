import {RenderHexCanvas} from "./hex/pointyTop/RenderHexCanvas";
import {HexGrid} from "./hex/pointyTop/HexGrid";

import {CustomHexRenderer} from "./game/CustomHexRenderer";
const $ = require('./../bower_components/jquery/dist/jquery');

$(() => {
  const grid = HexGrid.createRectangle(10, 10);
  const $canvas = $('#canvas');
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
    let coord = HexGrid.HexCoords.from2dCoords(e.clientX - cameraX, e.clientY - cameraY, hexSize);

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
    let coord = HexGrid.HexCoords.from2dCoords(e.clientX - cameraX, e.clientY - cameraY, hexSize);

    let hex = grid.getHexAt(coord);

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

          });

          lineHexes = null;
        } else {
          lineEnd = hex;

          lineHexes = grid.lineTo(lineStart, lineEnd);

          if( lineHexes && lineHexes.length > 0) {
            lineHexes.forEach((hex) => {

              hex.modules['render-content-2d'].fillStyle = '#6F6';
            });
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
