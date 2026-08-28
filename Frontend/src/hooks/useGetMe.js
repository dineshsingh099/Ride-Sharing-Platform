import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userService } from "../services/userServices";
import { partnerService } from "../services/partnerServices";
import { extractErrorMessage } from "../utils/errorHandler";
import { setUserData, clearUser } from "../redux/userSlice";
import { setPartnerData, clearPartner } from "../redux/partnerSlice";

export function useGetMe(role = "user") {
	const dispatch = useDispatch();
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchMe = useCallback(async () => {
		setLoading(true);
		setError("");

		try {
			if (role === "partner") {
				const data = await partnerService.getCurrentPartner();
				setMe(data.partner);
				dispatch(setPartnerData(data.partner));
			} else {
				const data = await userService.getCurrentUser();
				setMe(data.user);
				dispatch(setUserData(data.user));
			}
		} catch (err) {
			setMe(null);
			if (role === "partner") {
				dispatch(clearPartner());
			} else {
				dispatch(clearUser());
			}
			setError(extractErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}, [role, dispatch]);

	useEffect(() => {
		fetchMe();
	}, [fetchMe]);

	return { me, loading, error, refetch: fetchMe };
}
