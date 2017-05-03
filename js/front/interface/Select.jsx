import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class Select extends BEMComponent {
  constructor(props) {
    super(props, 'select');
  }

  render() {
    //
    return <div className={this.blockName}>
      {(this.props.label) && <label className={this.element('label')} id={this.labelId} for={this.id}>{this.props.label}</label> }
      <select {...this.props.props} id={this.id} className={this.element('field')} onChange={this.props.onChange}>
        {this.props.values.map((value, index) => {
          return <option key={value} value={index}>{value}</option>
        })}
      </select>
    </div>
  }

  get id() {
    return this.props.id || this.key;
  }

  get labelId () {
    return this.props.labelId || this.id+'_label';
  }

}


Select.defaultProps = {

};
