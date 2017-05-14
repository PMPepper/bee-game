export function GetFactionChanges(gameState) {
  const stateObj = gameState.stateObj;
  const originalState = gameState.originalFactionState;

  //1. Colonies
  const deltaColonies = getObjectDifferences(gameState.colonies, originalState.colonies, colonyTransform, colonyTransform);

  //Finally, return an object with all changes
  const ret = {
    colonies: deltaColonies
  };

  console.log('GetFactionChanges:');
  console.log(ret);

  return ret;
}

function getObjectDifferences(newStates, oldStates, addedTransform, removedTransform) {
  addedTransform = addedTransform || passthrough;
  removedTransform = removedTransform || passthrough;

  const delta = {
    added:{},
    removed:{}
  };

  //clone the object, so I can safely modify it
  oldStates = Object.assign({}, oldStates);

  for(let id in newStates) {
    if(newStates.hasOwnProperty(id)) {
      let state = newStates[id];

      if(state.removed === true && oldStates.hasOwnProperty(id)) {
        //it's been removed, and it's not a temporary state
        delta.removed[id] = removedTransform(state);
      } else if(state.removed !== true && !oldStates.hasOwnProperty(id)) {
        //it's been added
        delta.added[id] = addedTransform(state);
      }

      delete oldStates[id];//whatever happens, delete from oldStates object
    }

    //oldStates now only holds things which used to be present, but now aren't
    for(let id in oldStates) {
      if(oldStates.hasOwnProperty(id)) {
        delta.removed[id] = removedTransform(oldStates[id]);
      }
    }
  }

  return delta;
}

//transforms
function passthrough(val) {return val;}

function colonyTransform(colony) {
  return colony.systemBody.id;
}
