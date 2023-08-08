import { combineReducers } from "@reduxjs/toolkit";

const staticReducers = {};

export function createReducer(injectedReducers = {}) {
  // Initially we don't have any injectedReducers, so returning identity function to avoid the error
  if (Object.keys(injectedReducers).length === 0) {
    return (state) => state;
  } else {
    return combineReducers({
      ...staticReducers,
      ...injectedReducers,
    });
  }
}
