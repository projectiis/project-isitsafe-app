import { RatingsActions } from './index';
const { ADD_RATING, EDIT_RATING, DELETE_RATING } = RatingsActions;

export const addRating = (id, placeId, userId, rules) => ({
  type: ADD_RATING,
  id,
  placeId,
  userId,
  rules,
});

export const editRating = (id, newRules) => ({
  type: EDIT_RATING,
  id,
  newRules,
});

export const deleteRating = id => ({
  type: DELETE_RATING,
  id,
});
