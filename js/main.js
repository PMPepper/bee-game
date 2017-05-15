const $ = require('./../bower_components/jquery/dist/jquery');

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
    //Initial game Config
    const gameConfig = Object.freeze({
      minerals: [
        'corbynite',
        'quadlithium',
        'neutronium',
        'kriptinite',
        'meseonite',
        'blairite',
        'selenicite',
        'baryonium',
        'hadronium',
        'thatcherite',
        'leonium',
        'brownite'
      ],
      bodyTypeMineralModifiers: {
        'gas giant': {//gas giants only have quadlithium, and low density (but their huge size makes up for it)
          corbynite:0,
          quadlithium:0.5,
          neutronium: 0,
          kriptinite: 0,
          meseonite: 0,
          blairite: 0,
          selenicite: 0,
          baryonium: 0,
          hadronium: 0,
          thatcherite: 0,
          leonium: 0,
          brownite: 0
        }
      },
      baseMineralDensity: 1/1000000000000000000,
      gameStartTime:Math.floor(Date.now()/1000)
    });

    //Initialise world
    const gameModel = new Game(gameConfig);

    //-init faction

    //id, colonies, craft, knownTechnologies, knownFactions, knownSystems, knownContacts
    const faction = new Faction( 'The Human Empire', 'Humanity', 'Human', {}, {}, {}, {}, {}, {});

    //Make this faction humans and add tSol system, on Earth
    const system = InitialiseGame.createHomeSystemFromKnownFor('Sol', 'Sol', faction, 'human', {population:500000000});



    gameModel.addSystem(system);
    gameModel.addFaction(faction);
    //-end init



    //Create game engine
    const engine = new Engine(gameModel);

    //Create frontend
    const client = new Client($('#app'), gameConfig);

    //tie client to a faction
    client.factionId = faction.id;

    //Create Connector
    const connector = new ConnectorBasic(engine, client);
  }, 0);
});
