import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';

export class List extends BEMComponent {
  constructor(props) {
    super(props, 'list');

    this.ordered = false;
  }

  render() {
    if(this.ordered) {
      return <ol className={this.blockClasses}>{this.renderContents()}</ol>
    } else {
      return <ul className={this.blockClasses}>{this.renderContents()}</ul>
    }
  }

  renderContents() {
    if(!this.props.children) {
      return null;
    }

    return this.props.children.map((item, index) => {
      if(React.isValidElement(item) && item.type == 'li') {
        //TODO clone props
        return <li {...item.props} className={this.element('item')+(item.props.className ? ' '+item.props.className : '')} key={index}>{item.props.children}</li>
      } else {
        console.log(item);
        return <li className={this.element('item')} key={index}>{item}</li>
      }


    });
  }
}
