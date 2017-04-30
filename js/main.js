const $ = require('./../bower_components/jquery/dist/jquery');
require('./interface/jquery-mousewheel.js').init($);

require('./example.jsx')

import {System} from './systems/System';
import {Star} from './systems/Star';
import {Planet} from './systems/Planet';


import {SystemRendererCanvas} from './render/SystemRendererCanvas';

$(() => {
  let lastTime = Date.now();

  let time = 0;


  function step(timestamp) {
    const now = Date.now();
    const frameTime = now - lastTime;


    time += frameTime * 100;

    solRenderer.render(time);

    //Repeat
    lastTime = now;
    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);


  //Test code
  //name, mass, radius, parent, orbitRadius, orbitOffset
  const solA = new Star('Sol A', 1.9891e30, 695700000);
  //name, mass, radius, parent, orbitRadius, orbitOffset, albedo, minerals, colonies, atmosphere, type
  const earth = new Planet('Earth', 5.972e24, 6371000, solA, 149600000000, 0, 0.3, null, 'planet');
  const luna = new Planet('Luna', 7.34767309e22, 1737000, earth, 384399000, 0, 0.12, null, 'moon');

  const bodies = [
    solA,
    earth,
    luna
  ];

  const system = new System( 'Sol', bodies);

  console.log(earth.orbitalPeriod);
  console.log(earth.getOrbitAngle(0)+', '+earth.getOrbitAngle(earth.orbitalPeriod * 0.5)+', '+earth.getOrbitAngle(86400));
  console.log(earth.surfaceGravity+', '+luna.surfaceGravity);

  //renderer
  const canvas = $('#system')[0];

  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete

  const solRenderer = new SystemRendererCanvas(system, canvas);


});
