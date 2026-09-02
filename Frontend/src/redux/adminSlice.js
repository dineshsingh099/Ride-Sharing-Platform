import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	adminData: null,
	isAuthenticated: false,
};

export const adminSlice = createSlice({
	name: "admin",
	initialState,
	reducers: {
		setAdminData: (state, action) => {
			state.adminData = action.payload;
			state.isAuthenticated = true;
		},

		setAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload;
		},

		clearAdmin: (state) => {
			state.adminData = null;
			state.isAuthenticated = false;
		},
	},
});

export const { setAdminData, setAuthenticated, clearAdmin } = adminSlice.actions;

export default adminSlice.reducer;
