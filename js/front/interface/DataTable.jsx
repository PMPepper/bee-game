import React from 'react';
import {render} from 'react-dom';
import {BEMComponent} from './BEMComponent.jsx';

export class DataTable extends BEMComponent {
  constructor(props) {
    super(props, 'dataTable');
  }

  componentWillMount() {
    //do a deep clone
    let data = window.JSON.parse(window.JSON.stringify(this.props.data));
    let sortedColumnIndex = null;
    let sortedColumnDirection = null;

    //normalise data, set default props, etc
    data.columns = data.columns.map((column, index) => {
      const cell = getCellObject(column);

      if(cell.sorted) {
        if(sortedColumnIndex !== null) {
          throw new Error('DataTable can only be sorted by one column at a time');
        }

        sortedColumnIndex = index;
        sortedColumnDirection = cell.sorted;
      }

      return cell;
    })

    data.rows.forEach((row) => {normaliseRowArray(row, data.columns)});

    //store in state
    this.setState({data: data, sortedColumnIndex: sortedColumnIndex, sortedColumnDirection: sortedColumnDirection});
  }

  render() {
    const data = this.state.data;

    if(!data) {
      return null;
    }

    const columns = data.columns;
    const rows = data.rows;

    return <table className={this.blockClasses}>
      <thead className={this.element('thead')}>
        <tr className={this.element('row', {header:null})}>
          {columns.map((column, index) => {
            const modifiers = {};

            if(column.sortable) {
              modifiers.sortable = null;
            }

            if(column.sorted) {
              modifiers.sorted = column.sorted;
            }

            return <th
                      onDoubleClick={(e) => {e.preventDefault();}}
                      onClick={column.sortable ? (e) => {e.preventDefault(); e.stopPropagation(); this._sortOnColumn(column, index, true)} : null}
                      onMouseEnter={column.sortable ? (e) => {this._mouseEnterColumn(column, index)} : null}
                      onMouseLeave={column.sortable ? (e) => {this._mouseLeaveColumn(column, index)} : null}
                      key={column.label}
                      className={this.element('th', Object.assign({}, column.modifiers, modifiers))}
                    >{column.label}</th>
          })}
        </tr>
      </thead>
      <tbody className={this.element('tbody')}>
        {rows.map((row) => {
          return <tr key={row.key} className={this.element('row', {body:null})}>
            {row.map((cell, index) => {
              let columnLabel = columns[index].label;

              return <td key={columnLabel} className={this.element('td', cell.modifiers)}>{cell.label}</td>
            })}
          </tr>
        })}
      </tbody>
    </table>
  }

  _sortOnColumn(column, index, clicked) {
    if(!column.sortable) {
      return;
    }

    //read data out of state (state only changes asynchronosly, so don't refer back to it while changing stuff, because it won't have changed)
    const state = this.state;
    const data = state.data;
    let sortedColumnIndex = state.sortedColumnIndex;
    let sortedColumnDirection = state.sortedColumnDirection;

    //first, find currently sorted column and remove
    if(sortedColumnIndex == index) {
      //toggle direction
      data.columns[index].sorted = sortedColumnDirection = (sortedColumnDirection == 'asc' ? 'desc' : 'asc');
    } else {
      //sort on a new column
      //-clear old sorting value
      delete data.columns[sortedColumnIndex].sorted;

      //set new sorting values
      //-always default to asc sorting
      data.columns[index].sorted = sortedColumnDirection = 'asc';
      sortedColumnIndex = index;
    }

    //now re-sort the data
    const rows = data.rows;

    rows.sort((sortedColumnDirection == 'asc') ?
      (rowA, rowB) => {
        const valueA = rowA[index].value;
        const valueB = rowB[index].value;

        return valueB > valueA ? 1 : -1;
      }
      :
      (rowA, rowB) => {
        const valueA = rowA[index].value;
        const valueB = rowB[index].value;

        return valueA > valueB ? 1 : -1;
      }
    );

    //now check the hovering code stuff
    if(clicked) {
      this._mouseEnterColumn(data.columns[sortedColumnIndex], sortedColumnIndex);
    }

    //finally set new state values
    state.sortedColumnDirection = sortedColumnDirection;
    state.sortedColumnIndex = sortedColumnIndex;

    this.setState(state);
  }

  _mouseEnterColumn(column, index) {
    if(!column.sortable) {
      return;
    }

    let data = this.state.data;

    column.modifiers.hovered = null;
    column.modifiers.sort = column.sorted && column.sorted == 'asc' ? 'desc' : 'asc';

    data.rows.forEach((row) => {
      row[index].modifiers.sortableColumnHovered = null;
    });

    this.setState(this.state);
  }

  _mouseLeaveColumn(column, index) {
    if(!column.sortable) {
      return;
    }

    let data = this.state.data;

    delete column.modifiers.hovered;
    delete column.modifiers.sort;

    data.rows.forEach((row) => {
      delete row[index].modifiers.sortableColumnHovered;
    });

    this.setState(this.state);
  }
}

//data normalisation methods
function getRowKey(row) {
  if(row.hasOwnProperty('key')) {
    return row.key;
  }

  return row.map((cell) => {
    let keys = Object.keys(cell);
    keys.sort();

    return '{'+keys.map((key) => {
      return key+':'+cell[key];
    }).join(',')+'}';
  }).toString();
}

function getCellObject(cell) {
  switch(typeof(cell)) {
    case 'number':
    case 'string':
    case 'boolean':
    case 'undefined':
      return {label: cell, key: cell, modifiers: {}};
    case 'function':
      return {label: cell('label'), key: cell('key'), modifiers: {}};
    case 'object':

      if(!('label' in cell)) {
        throw new Error('DataTable cell object needs a label property');
      }

      if(!('modifiers' in cell)) {
        cell.modifiers = {};
      }

      if(!('key' in cell)) {
        cell.key = cell.label;
      }
      return cell;
  }

  return null;
}

function normaliseRowArray(row, columns) {
  row.forEach((cell, index) => {
    row[index] = getCellObject(cell);

    row[index].column = columns[index];
  })

  row.key = getRowKey(row);
}
