import {List} from './List.jsx';

export class OList extends List {
  constructor(props) {
    super(props);
    this.ordered = true;
  }

}
