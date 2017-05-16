import React from 'react';
import {render} from 'react-dom';
import {Client} from '../logic/Client';
import {BEMComponent} from './BEMComponent.jsx';
import {ReactComponentController} from './ReactComponentController';
import {Tabs} from './Tabs.jsx';
import {TabPanel} from './TabPanel.jsx';
import {Helpers} from '../Helpers';
import {DataTable} from './DataTable.jsx';

class ColonyDetailsRenderer extends BEMComponent {
  constructor(props) {
    super(props, 'colonyDetails');
  }

  render() {
    if(!this.props.colony) {
      return <article className={this.blockClasses}>No colony selected</article>
    }
    return <article className={this.blockClasses}>
      <div className={this.element('coloniesListHolder')}>
        TODO list all colonies
      </div>
      <div className={this.element('selectedColonyDetails')}>
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
      </div>

    </article>
  }

  _getMineralData() {
    const minerals = Client.getGameConfig().minerals;
    const colony = this.props.colony;

    minerals.sort();

    const data = {
      columns:[
        {
          label:'Mineral Name',
          sortable: true,
          sorted: 'asc',
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
        label: 0,
        value: 0
      })

      //Depletion (years/date) cell
      mineralRow.push({
        label: '0/'+Helpers.formatDate(null),
        value: 0
      })

      //Stockpile cell
      mineralRow.push({
        label: 0,
        value: 0
      })

      //Stockpile Change cell
      mineralRow.push({
        label: 0,
        value: 0
      })

      //Mass Driver cell
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

  _getMineralDataOld() {
    const minerals = Client.getGameConfig().minerals;
    const colony = this.props.colony;

    return minerals.map((mineralName) => {
      const bodyMinerals = colony.systemBody.body.minerals ? colony.systemBody.body.minerals.getMineralByName(mineralName) : null;
      //TODO get stockpile

      return <tr key={mineralName}>
              <td>{Helpers.ucFirst(mineralName)}</td>
              <td>{bodyMinerals ? Helpers.formatNumber(bodyMinerals.amount) : '-'}</td>
              <td>{bodyMinerals ? bodyMinerals.accessibility : '-'}</td>
              <td>0</td>
              <td>0/{Helpers.formatDate(null)}</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
    })

    return
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
  }

  get colony() {
    if(!this._gameState || !this._colonyId) {
      return null;
    }

    return this._gameState.getStateById(this._colonyId);
  }

  set colony(value) {
    this._colonyId = value ? value.id : null;
    this._doReRender();
  }

  render() {
    return <ColonyDetailsRenderer colony={this.colony} gameState={this._gameState} />
  }
}


export const ColonyDetails = Object.freeze({
  Renderer: ColonyDetailsRenderer,
  Controller: ColonyDetailsController
});
