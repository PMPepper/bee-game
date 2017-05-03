import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class Date extends BEMComponent {
  constructor(props) {
    super(props, 'date');
  }

  render() {
    const dateObj = this.dateObj;

    return <time className={this.blockClasses} dateTime={dateObj.toISOString()}>{dateObj.toString()}</time>;
  }

  get dateObj () {
    return new window.Date((this.props.date||0)*1000);
  }

}
