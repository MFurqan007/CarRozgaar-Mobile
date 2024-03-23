"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    uid: "Null",
};

export const currentUser = createSlice({
    name: "currentuser",
    initialState,
    reducers: {
        userChange: (state, action) =>{
            state.uid = action.payload;
        },
    },
});

export const {userChange} = currentUser.actions;
export default currentUser.reducer;