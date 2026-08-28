import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	userData: null,
	isAuthenticated: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserData: (state, action) => {
			state.userData = action.payload;
			state.isAuthenticated = true;
		},

		setAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload;
		},

		clearUser: (state) => {
			state.userData = null;
			state.isAuthenticated = false;
		},
	},
});

export const { setUserData, setAuthenticated, clearUser } = userSlice.actions;

export default userSlice.reducer;
