import { UsedIdsActions } from '../actions/index';
const { ADD_ID, DELETE_ID } = UsedIdsActions;

export const usedIdsReducer = (state = [], action) => {
  let tmpState = [...state];

  switch (action.type) {
    case ADD_ID:
      return [...tmpState, action.id];
    case DELETE_ID:
      const index = tmpState.indexOf(action.id);

      tmpState.splice(index, 1);

      return tmpState;
    default:
      return state;
  }
};
