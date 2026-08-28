import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleUserPayload {
	googleId: string;
	name: string;
	email: string;
	avatar: string;
	verified: boolean;
}

class GoogleAuthService {
	async verifyGoogleToken(
		idToken: string,
		rawNonce: string,
	): Promise<GoogleUserPayload> {
		const ticket = await googleClient.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			throw new Error("Invalid Google token");
		}

		if (!payload.email_verified) {
			throw new Error("Google email is not verified");
		}

		if (!payload.nonce || payload.nonce !== rawNonce) {
			throw new Error("Invalid nonce");
		}

		return {
			googleId: payload.sub,
			name: payload.name || "",
			email: payload.email || "",
			avatar: payload.picture || "",
			verified: true,
		};
	}
}

export const googleAuthService = new GoogleAuthService();
