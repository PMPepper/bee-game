import React from 'react';
import {render} from 'react-dom';

const elementSep = '-';
const modifierSep = '_';

export class BEMComponent extends React.Component {
  constructor(props, defaultBlockName) {
    super(props);

    this._blockName = props.blockName || defaultBlockName || 'block';

    this._key = key++;

    this._modifiers = {};
  }

  get key () {
    return this._key;
  }

  get blockName() {
    return this._blockName;
  }

  get blockClasses() {
    return this._bemClasses(this.blockName);
  }

  get hasChildren() {
    const children = this.children;

    return children && children.length > 0;
  }

  get children() {
    let children = this.props.children;

    if(children && !(children instanceof Array)) {
      return [children];
    }

    return children;
  }

  element(name, extras) {
    return this._bemClasses(this.blockName+elementSep+name, extras);
  }

  _getModifierValue(name) {
    const modifier = this._modifiers[name+''];
    let value = this.props[name];

    switch(modifier.type) {
      case 'boolean':
        return value === 'false' || value === '0' ? false : !!value;
      case 'string':
        return ''+value;
      case 'number':
        if(Number.isNaN(+value)) {
          throw new Error('Modifier value must be a number, invalid value: "'+value+'"');
        }
        return +value;
      case 'list':
        if(modifier.values.indexOf(value) == -1) {
          throw new Error('Modifier value must be one of ('+modifier.values.join(', ')+'), invalid value: "'+value+'"');
        }

        return value;
    }
  }

  _getModifierClass(name, baseClassName) {
    const value = this._getModifierValue(name);
    const modifier = this._modifiers[name+''];

    if(value === modifier.preset) {
      return '';
    }

    if(modifier.type == 'boolean' && modifier.preset === false) {
      return ' '+baseClassName+modifierSep+name;
    }

    return ' '+baseClassName+modifierSep+name+modifierSep+value;
  }

  _bemClasses(baseClassName, extras) {
    let className = baseClassName;

    for(let name in this._modifiers) {
      className += this._getModifierClass(name, baseClassName);
    }

    if(extras) {
      for(let mod in extras) {
        className += ' '+baseClassName+modifierSep+mod+modifierSep+extras[mod];
      }
    }

    return className;
  }
}

BEMComponent.getModifierFromElement = (element, name) => {
  const baseClassName = element.classList[0];

  for(let i = 1; i < element.classList.length; i++) {
    let classNameParts = element.classList[i].split(modifierSep);

    if(classNameParts[1] != name) {
      continue;
    }

    classNameParts.shift();
    classNameParts.shift();

    return classNameParts.join(modifierSep);
  }

  return null;
};

let key = 0;
