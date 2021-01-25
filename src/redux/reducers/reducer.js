import * as types from '../actionTypes';

const initialState = {
  userData: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case types.UPDATE_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};
