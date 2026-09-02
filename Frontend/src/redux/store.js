import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import partnerReducer from "./partnerSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		partner: partnerReducer,
		admin: adminReducer,
	},
});
