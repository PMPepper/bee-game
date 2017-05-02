const $ = require('./../bower_components/jquery/dist/jquery');
require('./front/interface/jquery-mousewheel.js').init($);

import {Client} from './front/logic/Client';

import {ConnectorBasic} from './core/connector/ConnectorBasic';

import {Engine} from './back/engine/Engine';
import {Factory} from './back/models/Factory';

window.$ = $;


$(() => {



  //Test code

  //Initialise world
  setTimeout(() => {
  const systems = [];

    (() => {
      const systemsData = require('./data/systems');

      systemsData.forEach((system) => {
        systems.push(Factory.getSystem(system));
      });
    })();

    //Create game engine
    const engine = new Engine(0, systems);

    //Create frontend
    const client = new Client($('#app'));

    //Create Connector
    const connector = new ConnectorBasic(engine, client);
  }, 0);
/*
  const earth = systems[0].getBodyByName('Earth');
  const luna = systems[0].getBodyByName('Luna');
  const solA = systems[0].getBodyByName('Sol A');

  const mars = systems[0].getBodyByName('Mars');
  const phobos = systems[0].getBodyByName('Phobos');*/

/*
  console.log('Earth surface gravity: '+earth.surfaceGravity+', Luna surface gravity'+luna.surfaceGravity);
  console.log('Min distance between Phobos and Luna: '+SystemBody.getMinBodyDistance(phobos, luna));
  console.log('Max distance between Phobos and Luna: '+SystemBody.getMaxBodyDistance(phobos, luna));
  console.log('Avg distance between Phobos and Luna: '+SystemBody.getAvgBodyDistance(phobos, luna));
  console.log('Luna surface heating (k): '+luna.minSurfaceHeating+' / '+luna.maxSurfaceHeating+' / '+luna.avgSurfaceHeating);
  console.log('Earth escape velocity: '+earth.escapeVelocity+', Luna: '+luna.escapeVelocity+', sol: '+solA.escapeVelocity);
*/
  //renderer
  /*
  const canvas = $('#system')[0];

  canvas.width = document.body.clientWidth; //document.width is obsolete
  canvas.height = document.body.clientHeight; //document.height is obsolete
*/
  //const solRenderer = new SystemRendererCanvas(systems[0], canvas);
});
