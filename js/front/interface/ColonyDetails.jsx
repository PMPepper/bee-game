import React from 'react';
import {render} from 'react-dom';
import {Client} from '../logic/Client';
import {BEMComponent} from './BEMComponent.jsx';
import {ReactComponentController} from './ReactComponentController';
import {Tabs} from './Tabs.jsx';
import {TabPanel} from './TabPanel.jsx';
import {Helpers} from '../Helpers';
import {DataTable} from './DataTable.jsx';
import {ScrollPane} from './ScrollPane.jsx';
import {TreeMenu} from './TreeMenu.jsx';
import {Constants} from '../../core/Constants';

class ColonyDetailsRenderer extends BEMComponent {
  constructor(props) {
    super(props, 'colonyDetails');
  }

  componentWillMount() {
    this.setState({colony:this.props.colony});
  }

  componentWillReceiveProps(props) {
    this.setState({colony:props.colony});
  }

  render() {
    if(!this.props.colony) {
      return <article className={this.blockClasses}>No colony selected</article>
    }

    return <article className={this.blockClasses}>
      <div className={this.element('coloniesListHolder')}>
        <TreeMenu onItemClick={(item) => {return this.props.onItemClickSetColony(item);}} data={this._getFactionColoniesData(this.state.colony)} />
      </div>
      <div className={this.element('selectedColonyDetails')}>
        <ScrollPane vertical={true}>
          <Tabs name="colonyDetailsTab" activeTab={2}>
            <TabPanel name="summary" title="Summary">
              <dl>
                <dt>Colony population: </dt>
                <dd>{this.props.colony.population}</dd>
                <dt>Colony population: </dt>
                <dd>{this.props.colony.population}</dd>
                <dt>Colony population: </dt>
                <dd>{this.props.colony.population}</dd>
                <dt>Colony population: </dt>
                <dd>{this.props.colony.population}</dd>
              </dl>
            </TabPanel>
            <TabPanel name="industry" title="Industry">TODO 2</TabPanel>
            <TabPanel name="mining" title="Mining">
              <DataTable data={this._getMineralData()} />
            </TabPanel>
            <TabPanel name="shipyards" title="Shpipyards">TODO 4</TabPanel>
            <TabPanel name="shipyardTasks" title="Shipyard Tasks">TODO 5</TabPanel>
            <TabPanel name="groundUnits" title="Ground Units">TODO 6</TabPanel>
            <TabPanel name="economy" title="Economy">TODO 7</TabPanel>
          </Tabs>
        </ScrollPane>
      </div>

    </article>
  }

  _onItemClickSetColony(item) {

  }

  _getFactionColoniesData(selectedColony) {
    const gameState = this.props.gameState;

    const knownSystems = gameState.knownSystems;
    const systems = [];

    for( let id in knownSystems) {
      if(knownSystems.hasOwnProperty(id)) {
        let knownSystem = knownSystems[id];

        let colonies = knownSystem.getFactionColonies();

        if(colonies.length > 0) {
          systems.push({
            label: knownSystem.name,
            key: knownSystem.id,
            isOpen: true,
            children: colonies.map((colony) => {
              return {
                label: colony.knownSystemBody.name,
                key: colony.id,
                selected: colony == selectedColony,
                isColony: true
              };
            })
          })
        }
      }
    }

    return systems;
  }

  _getMineralData() {
    const minerals = Client.getGameConfig().minerals;
    const colony = this.props.colony;
    const stockpile = colony.mineralsStockpile;

    minerals.sort();

    const data = {
      columns:[
        {
          label:'Mineral Name',
          sortable: true,
          sorted: 'desc',
          modifiers:{ex:1}
        },
        {
          label:'Quantity',
          sortable: true,
          modifiers:{ex:2}
        },
        {
          label:'Accessibility',
          sortable: true
        },
        {
          label:'Production',
          sortable: true
        },
        {
          label:'Depletion (years/date)',
          sortable: true
        },
        {
          label:'Stockpile',
          sortable: true
        },
        {
          label:'Stockpile Change',
          sortable: true
        },
        {
          label:'Mass Driver',
          sortable: true
        },
        {
          label:'SP + Production',
          sortable: true
        }
      ],
      rows:[]
    };

    minerals.forEach((mineralName) => {
      const mineralRow = [];

      //get data about this mineral
      const bodyMinerals = colony.systemBody.body.minerals ? colony.systemBody.body.minerals.getMineralByName(mineralName) : null;
      const stockpile = colony.mineralsStockpile.getMineralQty(mineralName);
      const production = 0;//production is per day
      const depletionDays = Math.round(stockpile/production);
      const depletionDate = depletionDays > 0 ? new window.Date((this.props.gameState.time+(depletionDays*Constants.DAY)) * 1000) : null ;

      if(bodyMinerals === null) {
        return;
      }

      //Mineral name cell
      mineralRow.push({
        label: Helpers.ucFirst(mineralName),
        value: mineralName
      })

      //Quantity cell
      mineralRow.push({
        label:(bodyMinerals ? Helpers.formatNumber(bodyMinerals.amount) : '-'),
        value: bodyMinerals ? bodyMinerals.amount : 0
      })

      //Accessibility cell
      mineralRow.push({
        label:(bodyMinerals ? bodyMinerals.accessibility : '-'),
        value: bodyMinerals ? bodyMinerals.accessibility : 0
      })

      //Production cell
      mineralRow.push({
        label: Helpers.formatNumber(production),
        value: production
      })

      //Depletion (years/date) cell
      mineralRow.push({
        label: '0/'+Helpers.formatDate(depletionDate),
        value: depletionDays
      })

      //Stockpile cell
      mineralRow.push({
        label: Helpers.formatNumber(stockpile),
        value: stockpile
      })

      //Stockpile Change cell
      //TODO compare to 30 days ago? How?
      mineralRow.push({
        label: 0,
        value: 0
      })

      //Mass Driver cell
      //TODO
      mineralRow.push({
        label: 0,
        value: 0
      })

      //SP + Production cell
      mineralRow.push({
        label: 0,
        value: 0
      })

      data.rows.push(mineralRow);
    });

    return data;
  }
}

class ColonyDetailsController extends ReactComponentController {
  constructor (client, colony) {
    super();

    this._gameStateUpdatedListener = client.addListener('gameStateUpdated', (event) => {
      this._gameState = event.updatedGameState;
    });

    //naughty..
    this._gameState = client._state;
    this._colonyId = colony ? colony.id : null;

    this._onItemClickSetColony = this._onItemClickSetColony.bind(this);
  }

  get colony() {
    if(!this._gameState || !this._colonyId) {
      return null;
    }

    return this._gameState.getStateById(this._colonyId);
  }

  set colony(value) {
    const newValue = value ? value.id : null;

    if(newValue != this._colonyId) {
      this._colonyId = newValue;
      this._doReRender();
    }
  }

  _onItemClickSetColony(item) {
    if(item.isColony) {
      const colony = this._gameState.getStateById(item.key);

      if(!colony) {
        return false;
      }

      this.colony = colony;

      return false;
    }

    return false;
  }

  render() {
    return <ColonyDetailsRenderer colony={this.colony} gameState={this._gameState} onItemClickSetColony={this._onItemClickSetColony} />
  }
}


export const ColonyDetails = Object.freeze({
  Renderer: ColonyDetailsRenderer,
  Controller: ColonyDetailsController
});
