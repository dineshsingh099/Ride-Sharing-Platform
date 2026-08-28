import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file: Buffer): Promise<string | null> => {
	if (!file) {
		return null;
	}

	try {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: "auto",
				},
				(error, result) => {
					if (error) {
						console.error("Error uploading to Cloudinary:", error);
						reject(null);
					} else {
						resolve(result?.secure_url ?? null);
					}
				},
			);
			uploadStream.end(file);
		});
	} catch (error) {
		console.error("Error uploading to Cloudinary:", error);
		return null;
	}
};

export default uploadOnCloudinary;
