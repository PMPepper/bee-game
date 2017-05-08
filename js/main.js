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
    //Initialise world
    //-init faction

    //id, colonies, craft, knownTechnologies, knownFactions, knownSystems, knownContacts
    const faction = new Faction( 'The Human Empire', 'Humanity', 'Human', {}, {}, {}, {}, {}, {});

    //Make this faction humans and add tSol system, on Earth
    const system = InitialiseGame.createHomeSystemFromKnownFor('Sol', 'Sol', faction, 'human', {population:500000000});

    const gameModel = new Game(Math.floor(Date.now()/1000));

    gameModel.addSystem(system);
    gameModel.addFaction(faction);
    //-end init

    //Create game engine
    const engine = new Engine(gameModel);

    //Create frontend
    const client = new Client($('#app'));

    //tie client to a faction
    client.factionId = faction.id;

    //Create Connector
    const connector = new ConnectorBasic(engine, client);
  }, 0);
});
