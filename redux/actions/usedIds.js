import { UsedIdsActions } from './index';
const { ADD_ID, DELETE_ID } = UsedIdsActions;

export const addId = id => ({
  type: ADD_ID,
  id,
});

export const deleteId = id => ({
  type: DELETE_ID,
  id,
});
