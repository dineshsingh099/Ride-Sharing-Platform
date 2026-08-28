import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	service: "gmail",
	pool: true,
	maxConnections: 5,
	maxMessages: 100,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendMail = async (to: string, subject: string, html: string) => {
	try {
		await transporter.sendMail({
			from: `"RideX" <${process.env.EMAIL}>`,
			to,
			subject,
			html,
		});

		console.log(`Email sent successfully to ${to}`);
	} catch (error) {
		console.error("Email sending failed:", error);
		throw error;
	}
};
