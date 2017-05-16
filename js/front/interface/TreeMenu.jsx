import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';

const JSON = window.JSON;

export class TreeMenu extends BEMComponent {
  constructor(props) {
    super(props, 'treeMenu');

    this._renderList = this._renderList.bind(this);
    this._onItemClicked = this._onItemClicked.bind(this);
    this._onClickItemBtn = this._onClickItemBtn.bind(this);
  }

  componentWillMount() {
    this.setState({data: normaliseData(JSON.parse(JSON.stringify(this.props.data)))});
  }

  render() {
    const data = this.state.data;

    return <div className={this.blockClasses}>
      {this._renderList(data, 1)}
    </div>
  }

  //event handlers
  _onItemClicked(e, item) {
    e.preventDefault();
    e.stopPropagation();

    //call handler, if supplied
    if(typeof(this.props.onItemClick) == 'function') {
      this.props.onItemClick(item);
    }

    if(this.state.selected) {
      if(this.state.selected == item) {
        return;
      }
    }

    this.state.selected = item;

    this.setState(this.state);
  }

  _onClickItemBtn(e, item) {
    e.preventDefault();
    e.stopPropagation();

    //toggle and item open and closed
    item.isOpen = !item.isOpen;

    this.setState(this.state);
  }

  //render methods
  _renderList(list, depth) {
    if(!list || list.length == 0) {
      return null;
    }
    return  <ul className={this.element('list', {depth: depth})}>
              {list.map((item, index) => {
                const modifiers = {depth: depth};

                if(item.isOpen) {
                  modifiers.isOpen = null;
                }

                if(item.children && item.children.length) {
                  modifiers.hasChildren = null;
                }

                if(index == list.length-1) {
                  modifiers.lastChild = null;
                }

                if(index == 0) {
                  modifiers.firstChild = null;
                }

                if(item == this.state.selected) {
                  modifiers.selected = null;
                }

                const listModifiers = Object.assign({}, item.modifiers, modifiers);

                return <li key={item.key} className={this.element('item', listModifiers)}>
                          {item.children && item.children.length > 0 &&
                            <button type="button" onClick={(e) => {this._onClickItemBtn(e, item)}} className={this.element('btn', modifiers)}></button>
                          }
                          <span onClick={(e) => {this._onItemClicked(e, item)}} className={this.element('label', modifiers)}>{item.label}</span>
                          {item.children && item.children.length > 0 &&
                            <div className={this.element('children', modifiers)}>
                              {this._renderList(item.children, depth+1)}
                            </div>
                          }
                        </li>
              })}
            </ul>
  }

}

//TODO get initially selected item

//Normalise data
function normaliseData(data) {
  if(!data) {
    return [];
  }

  if(!(data instanceof Array)) {
    throw new Error('Items list must be an array');
  }

  data.forEach((child, index) => {
    data[index] = normaliseObject(data[index]);
  });

  return data;
}

function normaliseObject(data) {
  if(typeof(data) != 'object') {
    data = {label: data, key: data, modifiers: {}, isOpen: false};
  } else {
    if(!data.modifiers) {
      data.modifiers = {};
    } else {
      delete data.modifiers.isOpen;
    }

    if(!('key' in data)) {
      data.key = data.label;
    }

    data.isOpen = !! data.isOpen;

    if(data.children) {
      data.children = normaliseData(data.children);
    } else {
      data.children = null;
    }
  }

  return data;
}
