import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../services/userServices";
import { partnerService } from "../services/partnerServices";
import { setUserData, clearUser } from "../redux/userSlice";
import { setPartnerData, clearPartner } from "../redux/partnerSlice";

export function useSessionUser() {
	const dispatch = useDispatch();
	const [checked, setChecked] = useState(false);

	const userData = useSelector((state) => state.user.userData);
	const partnerData = useSelector((state) => state.partner.partnerData);
	const isUserAuthenticated = useSelector(
		(state) => state.user.isAuthenticated,
	);
	const isPartnerAuthenticated = useSelector(
		(state) => state.partner.isAuthenticated,
	);

	useEffect(() => {
		if (userData || partnerData) {
			setChecked(true);
			return;
		}

		const loadSession = async () => {
			const [userResult, partnerResult] = await Promise.allSettled([
				userService.getCurrentUser(),
				partnerService.getCurrentPartner(),
			]);

			if (userResult.status === "fulfilled") {
				dispatch(setUserData(userResult.value.user));
			} else {
				dispatch(clearUser());
			}

			if (partnerResult.status === "fulfilled") {
				dispatch(setPartnerData(partnerResult.value.partner));
			} else {
				dispatch(clearPartner());
			}

			setChecked(true);
		};

		loadSession();
	}, [dispatch, userData, partnerData]);

	const profile = partnerData || userData;
	const isAuthenticated = isUserAuthenticated || isPartnerAuthenticated;
	const dashboardPath = partnerData ? "/partner/dashboard" : "/dashboard";

	return { profile, isAuthenticated, checked, dashboardPath };
}
