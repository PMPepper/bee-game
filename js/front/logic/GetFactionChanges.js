export function GetFactionChanges(gameState) {
  const stateObj = gameState.stateObj;
  const originalState = gameState.originalFactionState;

  //1. Colonies
  const deltaColonies = {};

  


  //Finally, return an object with all changes
  const ret = {
    colonies: deltaColonies
  };

  console.log('GetFactionChanges:');
  console.log(ret);

  return ret;
}
