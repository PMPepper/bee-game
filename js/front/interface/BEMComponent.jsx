import React from 'react';
import {render} from 'react-dom';

const elementSep = '-';

export class BEMComponent extends React.Component {
  constructor(props, defaultBlockName) {
    super(props);

    this._blockName = props.blockName || defaultBlockName || 'block';

    this._key = key++;
  }

  get key () {
    return this._key;
  }

  get blockName() {
    return this._blockName;
  }

  get blockClasses() {
    return this.blockName;
  }

  element(name, props) {
    return this.blockName+elementSep+name;
  }

}

let key = 0;
