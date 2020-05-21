import { PlacesActions } from './index';
const { ADD_PLACE } = PlacesActions;

export const addPlace = place => ({
  type: ADD_PLACE,
  place,
});
