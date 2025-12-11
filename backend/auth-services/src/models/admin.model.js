import mongoose from "mongoose";

const permissionsList = [
	"manage_drivers",
	"manage_users",
	"manage_rides",
	"manage_payments",
	"view_reports",
	"manage_promotions",
	"manage_vehicles",
	"manage_admins",
	"configure_settings",
];

const AdminSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: 3,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /.+\@.+\..+/,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			minlength: 10,
		},
		password: {
			type: String,
			required: true,
			select: false,
			minlength: 6,
		},
		permissions: {
			type: [String],
			default: permissionsList,
			validate: {
				validator: function (v) {
					return v.every((permission) => permissionsList.includes(permission));
				},
			},
		},
		
		lastLogonAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Admin = mongoose.model("admins", AdminSchema);

export default Admin;
