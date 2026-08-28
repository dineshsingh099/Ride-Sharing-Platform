import crypto from "crypto";

export const generateNonce = () => {
	return crypto.randomBytes(32).toString("hex");
};

export const hashNonce = (nonce: string) => {
	return crypto.createHash("sha256").update(nonce).digest("hex");
};
