const $ = require('./../bower_components/jquery/dist/jquery');
require('./front/interface/jquery-mousewheel.js').init($);

import {Client} from './front/logic/Client';

import {ConnectorBasic} from './core/connector/ConnectorBasic';

import {Engine} from './back/engine/Engine';
import {Faction} from './back/models/factions/Faction';
import {Game} from './back/models/Game';

import {InitialiseGame} from './back/InitialiseGame'


window.$ = $;

$(() => {



  //Temp game start code code

  setTimeout(() => {
    //Initialise world
    //-init faction

    //id, colonies, craft, knownTechnologies, knownFactions, knownSystems, knownContacts
    const faction = new Faction( {}, {}, {}, {}, {}, {});
    faction.addKnownFaction(faction, 'Humans');

    //Make this faction humans and add tSol system, on Earth
    InitialiseGame.createHomeSystemFromKnownFor('Sol', 'Sol', faction, 'human', {population:500000000});

    const gameModel = new Game(Math.floor(Date.now()/1000));

    gameModel.addFaction(faction);
    //-end init

    //Create game engine
    const engine = new Engine(gameModel);

    //Create frontend
    const client = new Client($('#app'));

    client.addFaction(faction.id);

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
