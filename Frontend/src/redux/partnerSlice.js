import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	partnerData: null,
	isAuthenticated: false,
};

export const partnerSlice = createSlice({
	name: "partner",
	initialState,
	reducers: {
		setPartnerData: (state, action) => {
			state.partnerData = action.payload;
			state.isAuthenticated = true;
		},

		setAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload;
		},

		clearPartner: (state) => {
			state.partnerData = null;
			state.isAuthenticated = false;
		},
	},
});

export const { setPartnerData, setAuthenticated, clearPartner } = partnerSlice.actions;

export default partnerSlice.reducer;
