import { PlacesActions } from '../actions/index';
const { ADD_PLACE } = PlacesActions;

export const placesReducer = (state = [], action) => {
  let tmpState = state.map(place => ({ ...place }));

  if (action.type === ADD_PLACE) {
    tmpState = [...tmpState, action.place];

    return tmpState;
  } else return state;
};
