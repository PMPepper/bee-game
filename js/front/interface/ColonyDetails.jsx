import React from 'react';
import {render} from 'react-dom';
import {Client} from '../logic/Client';
import {BEMComponent} from './BEMComponent.jsx';
import {ReactComponentController} from './ReactComponentController';
import {Tabs} from './Tabs.jsx';
import {TabPanel} from './TabPanel.jsx';
import {Helpers} from '../Helpers'

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
        <Tabs name="colonyDetailsTab" activeTab={0}>
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
            <table className="dataTable">
              <thead>
                <tr>
                  <th>Mineral Name</th>
                  <th>Quantity</th>
                  <th>Accessibility</th>
                  <th>Production</th>
                  <th>Depletion (years/date)</th>
                  <th>Stockpile</th>
                  <th>Stockpile change</th>
                  <th>Mass Driver</th>
                  <th>SP + Production</th>
                </tr>
              </thead>
              <tbody>
                {this._getMineralData()}
              </tbody>
            </table>
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
    console.log(colony);

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
