const $ = require('./../bower_components/jquery/dist/jquery');
require('./interface/jquery-mousewheel.js').init($);

require('./example.jsx')

import {System} from './systems/System';
import {SystemBody} from './systems/SystemBody';
import {Star} from './systems/Star';
import {Planet} from './systems/Planet';
import {RegularOrbit} from './systems/RegularOrbit';


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
  //name, mass, radius, parent, orbit, luminosity
  const solA = new Star('Sol A', 1.9891e30, 695700000, null, null, 3.846e26);
  //name, mass, radius, parent, orbit, albedo, minerals, colonies, atmosphere, type
  const earth = new Planet('Earth', 5.972e24, 6371000, solA, new RegularOrbit(149600000000, 0), 0.3, null, 'planet');
  const luna = new Planet('Luna', 7.34767309e22, 1737000, earth, new RegularOrbit(384399000, 0), 0.12, null, 'moon');

  const bodies = [
    solA,
    earth,
    luna
  ];

  const system = new System( 'Sol', bodies);

  console.log('Earth surface gravity: '+earth.surfaceGravity+', Luna surface gravity'+luna.surfaceGravity);

  console.log('Min distance between sun and moon: '+SystemBody.getMinBodyDistance(solA, luna));
  console.log('Max distance between sun and moon: '+SystemBody.getMaxBodyDistance(solA, luna));
  console.log('Avg distance between sun and moon: '+SystemBody.getAvgBodyDistance(solA, luna));
  console.log('Earth surface heating (k): '+earth.minSurfaceHeating+' / '+earth.maxSurfaceHeating+' / '+earth.avgSurfaceHeating);
  console.log('Earth escape velocity: '+earth.escapeVelocity+', Luna: '+luna.escapeVelocity+', sol: '+solA.escapeVelocity);

  //renderer
  const canvas = $('#system')[0];

  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete

  const solRenderer = new SystemRendererCanvas(system, canvas);


});
