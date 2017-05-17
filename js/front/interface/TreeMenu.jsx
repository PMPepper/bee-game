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
    this._parsePropIntoState(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    this._parsePropIntoState(nextProps.data);
  }

  //TODO reconcile state - e.g. open/close states? Is that feasible?
  _parsePropIntoState(propData) {
    let selectedObj = {};

    const newState = {data: normaliseData(JSON.parse(JSON.stringify(propData)), selectedObj)};

    if(selectedObj.selected) {
      newState.selected = selectedObj.selected;
    }

    this.setState(newState);
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
      let retVal = this.props.onItemClick(item);

      if(retVal === false) {
        return;//if handler returns false, do not select this item
      }
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

                //set calculated modifiers
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
function normaliseData(data, selectedObj) {
  if(!data) {
    return [];
  }

  if(!(data instanceof Array)) {
    throw new Error('Items list must be an array');
  }

  data.forEach((child, index) => {
    data[index] = normaliseObject(data[index], selectedObj);
  });

  return data;
}

function normaliseObject(data, selectedObj) {
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
      data.children = normaliseData(data.children, selectedObj);
    } else {
      data.children = null;
    }

    if(data.selected) {
      if(selectedObj.selected) {
        throw new Error('Cannot have multiple selected items in a tree menu');
      }

      selectedObj.selected = data;
    }
  }

  return data;
}
