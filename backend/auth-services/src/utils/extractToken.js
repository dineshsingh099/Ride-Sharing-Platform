export function extractToken(req) {
	const cookieToken = req.cookies?.token_user;
	if (cookieToken) return cookieToken;
	const auth = req.headers?.authorization;
	if (!auth) return null;
	const parts = auth.split(" ");
	if (parts.length === 2 && parts[0].toLowerCase() === "bearer")
		return parts[1];
	return null;
}
