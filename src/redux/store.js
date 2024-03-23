'use client';

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import currenUserReducer from './Features/CurrentUser/currentUser'

const rootReducer = combineReducers({
    currentuser: currenUserReducer
    // add all other reducers
},);

export const store = configureStore({
    reducer: rootReducer,
});