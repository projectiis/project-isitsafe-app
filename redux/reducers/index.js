import { combineReducers } from 'redux';

import { ratingsReducer } from './ratings';
import { placesReducer } from './places';

export default combineReducers({
  ratings: ratingsReducer,
  places: placesReducer,
});
