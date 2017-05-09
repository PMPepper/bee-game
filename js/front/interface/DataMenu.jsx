import React from 'react';
import {BEMComponent} from './BEMComponent.jsx';

export class DataMenu extends BEMComponent {
  constructor(props) {
    super(props, 'dataMenu');

    this._modifiers['direction'] = {
      type: 'list',
      values: ['horizontal', 'vertical']
    };
  }

  componentWillMount() {
    this.setState({style: {left: this.props.x, top: this.props.y}});
  }

  render() {
    return <ul className={this.blockClasses}>
      {this.props.items.map((item, index) => {
        switch(item.type) {
          case 'separator':
            return this._getSeparator(item, index);
          case 'leaf':
            return this._getLeaf(item, index);
          case 'submenu':
            return this._getSubmenu(item, index);
        }
      })}
    </ul>
  }

  _getSeparator(item ,index) {
    return <li key={item.key || index} className={this.element('item', {type: 'separator'})}></li>;
  }

  _getLeaf(item ,index) {
    const onClickHandler = (this.props.onItemClick ? (e) => {
      this.props.onItemClick(e, item);
    } : null);

    return  <li {...item.props} key={item.key || index}  className={this.element('item', {type: 'leaf'})}>
              <button {...item.props} onClick={onClickHandler} type="button" className={this.element('leaf-button')}>{item.label}</button>
            </li>;
  }

  _getSubmenu(item ,index) {
    return  <li key={item.key || index}  className={this.element('item', {typ: 'submenu'})}>
              <span {...item.props} className={this.element('submenu-label')}>{item.label}</span>
              <div className={this.element('submenu-items')}><DataMenu items={item.items} onItemClick={this.props.onItemClick} /></div>
            </li>
  }

}

DataMenu.defaultProps = {
  direction:'vertical'
};
