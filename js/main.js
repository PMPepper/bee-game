import {RenderHexCanvas} from "./hex/pointyTop/RenderHexCanvas";
import {HexGrid} from "./hex/pointyTop/HexGrid";


const $ = require('./../bower_components/jquery/dist/jquery');

$(() => {
  const grid = HexGrid.createRectangle(10, 10);
  const renderer = new RenderHexCanvas($('#canvas')[0], grid);

  function step(timestamp) {
    renderer.render(0, 0);

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
});


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

for (let x of t1.iterate) {
    console.log(x);
}
