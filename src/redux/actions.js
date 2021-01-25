import * as types from './actionTypes';

export const setUserData = (payload) => ({
  type: types.SET_USER_DATA,
  payload,
});

export const updateUserData = (payload) => ({
  type: types.UPDATE_USER_DATA,
  payload,
});
