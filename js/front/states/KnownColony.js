//represents an colony belonging to a foreign faction
import {State} from './State';

export class KnownColony extends State {
  constructor(id, faction, systemBody) {
    super(id);
    
    this._faction = faction;
    this._systemBody = systemBody;
  }

  get faction() {
    return this._faction;
  }

  get systemBody() {
    return this._systemBody;
  }
}
