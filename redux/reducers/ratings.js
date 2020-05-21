import { RatingsActions } from '../actions';
const { ADD_RATING, EDIT_RATING, DELETE_RATING } = RatingsActions;

export const ratingsReducer = (state = [], action) => {
  let tmpState = state.map(rating => ({ ...rating }));

  let { type, id, placeId, userId, rules, newRules } = action,
    idToDelete;

  switch (type) {
    case ADD_RATING:
      tmpState = [...tmpState, { id, placeId, userId, rules }];

      return tmpState;
    case EDIT_RATING:
      for (let rating of tmpState) {
        if (rating.id === id) {
          rating.rules = newRules;
          break;
        }
      }

      return tmpState;
    case DELETE_RATING:
      tmpState.every((rating, i) => {
        if (rating.id === id) {
          idToDelete = i;

          return false;
        }

        return true;
      });

      tmpState.splice(idToDelete, 1);

      return tmpState;
    default:
      return state;
  }
};
