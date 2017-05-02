import {Factory} from './../states/Factory';
import React from 'react';
import {render} from 'react-dom';
import {SystemMapCanvasRenderer} from '../interface/SystemMapCanvasRenderer.jsx';


//import {Window} from '../interface/Window.jsx';
//import {Windowing} from '../interface/Windowing.jsx';


import {UList} from '../interface/UList.jsx';
import {OList} from '../interface/OList.jsx';
import {Tabs} from '../interface/Tabs.jsx';
import {TabPanel} from '../interface/TabPanel.jsx';

export class Client {
  constructor($element) {
    this._$element = $element;
    this._connector = null;
    this._state;
  }

  update(newStateObj) {
    this._getStateFromObj(newStateObj);

    //this._systemMap = render(<SystemMapCanvasRenderer/>, this.$element[0]);
    //this._systemMap.setSystemState(this._state.systems[0]);

    /*const windowing = render(<Windowing />, this.$element[0]);

    windowing.addWindow({id:'1', props:{ title: '1st window', other:1}, contents: {}});
    windowing.addWindow({id:'2', props:{ title: '2nd window', coo:3}, contents: {}});*/

    render(<div>
      <Tabs>
        <TabPanel title="Panel 1" name="panel1">
          <div>Panel 1 contents.</div>
        </TabPanel>
        <TabPanel title="Panel 2" name="panel2">
          <div>Panel 2 contents.</div>
        </TabPanel>
        <TabPanel title="Panel 3" name="panel3">
          <div>Panel 3 contents.</div>
        </TabPanel>
      </Tabs>
    </div>, this.$element[0]);
  }

  _getStateFromObj(newStateObj) {
    this._state = Factory.getState(newStateObj);
  }

  get $element() {
    return this._$element;
  }

  setConnector(connector) {
    this._connector = connector;
  }
}
