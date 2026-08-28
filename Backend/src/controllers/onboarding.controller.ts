import { Request, Response } from "express";
import Partner from "../models/partner";
import Vehicle from "../models/onboarding/vehicle.model";
import PartnerDocs from "../models/onboarding/docs.model";
import PartnerBank from "../models/onboarding/bank.model";
import uploadOnCloudinary from "../utils/cloudinary";

export async function submitVehicleDetails(req: Request, res: Response) {
	try {
		const ownerId = req.user?.id;
		const { type, vehicleModel, number } = req.body;

		const existingVehicle = await Vehicle.findOne({ owner: ownerId });

		let vehicle;
		if (existingVehicle) {
			existingVehicle.type = type;
			existingVehicle.vehicleModel = vehicleModel;
			existingVehicle.number = number;
			vehicle = await existingVehicle.save();
		} else {
			vehicle = await Vehicle.create({
				owner: ownerId,
				type,
				vehicleModel,
				number,
			});
		}

		await Partner.findByIdAndUpdate(ownerId, {
			$max: { partnerOnBoardingSteps: 1 },
		});

		return res.status(200).json({
			message: "Vehicle details saved successfully",
			vehicle,
			nextStep: 2,
		});
	} catch (error: any) {
		console.error(error);
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ message: "This vehicle number is already registered" });
		}
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function submitPartnerDocuments(req: Request, res: Response) {
	try {
		const ownerId = req.user?.id;
		const files = req.files as
			| { [fieldname: string]: Express.Multer.File[] }
			| undefined;

		const license = files?.license?.[0];
		const rc = files?.rc?.[0];
		const insurance = files?.insurance?.[0];
		const aadhar = files?.aadhar?.[0];

		if (!license || !rc || !insurance || !aadhar) {
			return res.status(400).json({
				message:
					"All 4 documents (Driving License, Vehicle RC, Vehicle Insurance, Aadhaar/PAN) are required",
			});
		}

		const [licenseUrl, rcUrl, insuranceUrl, aadharUrl] = await Promise.all([
			uploadOnCloudinary(license.buffer),
			uploadOnCloudinary(rc.buffer),
			uploadOnCloudinary(insurance.buffer),
			uploadOnCloudinary(aadhar.buffer),
		]);

		if (!licenseUrl || !rcUrl || !insuranceUrl || !aadharUrl) {
			return res.status(500).json({
				message: "Failed to upload one or more documents, please try again",
			});
		}

		let docs = await PartnerDocs.findOne({ owner: ownerId });
		if (docs) {
			docs.licenseUrl = licenseUrl;
			docs.rcUrl = rcUrl;
			docs.insuranceUrl = insuranceUrl;
			docs.aadharUrl = aadharUrl;
			docs.status = "pending";
			await docs.save();
		} else {
			docs = await PartnerDocs.create({
				owner: ownerId,
				licenseUrl,
				rcUrl,
				insuranceUrl,
				aadharUrl,
			});
		}

		await Partner.findByIdAndUpdate(ownerId, {
			$max: { partnerOnBoardingSteps: 2 },
		});

		return res.status(200).json({
			message: "Documents uploaded successfully",
			docs,
			nextStep: 3,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function submitBankDetails(req: Request, res: Response) {
	try {
		const ownerId = req.user?.id;
		const { accountHolderName, accountNumber, ifscCode, phoneNumber, upiId } =
			req.body;

		let bank = await PartnerBank.findOne({ owner: ownerId });
		if (bank) {
			bank.accountHolderName = accountHolderName;
			bank.accountNumber = accountNumber;
			bank.ifscCode = ifscCode;
			bank.phoneNumber = phoneNumber;
			bank.upiId = upiId;
			bank.status = "added";
			await bank.save();
		} else {
			bank = await PartnerBank.create({
				owner: ownerId,
				accountHolderName,
				accountNumber,
				ifscCode,
				phoneNumber,
				upiId,
				status: "added",
			});
		}

		await Partner.findByIdAndUpdate(ownerId, {
			$max: { partnerOnBoardingSteps: 3 },
		});

		return res.status(200).json({
			message: "Registration completed successfully",
			bank,
			onboardingCompleted: true,
		});
	} catch (error: any) {
		console.error(error);
		if (error.code === 11000) {
			return res
				.status(409)
				.json({ message: "This account number is already registered" });
		}
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function getOnboardingStatus(req: Request, res: Response) {
	try {
		const ownerId = req.user?.id;

		const [partner, vehicle, docs, bank] = await Promise.all([
			Partner.findById(ownerId),
			Vehicle.findOne({ owner: ownerId }),
			PartnerDocs.findOne({ owner: ownerId }),
			PartnerBank.findOne({ owner: ownerId }),
		]);

		if (!partner) {
			return res.status(404).json({ message: "Partner not found" });
		}

		return res.status(200).json({
			currentStep: partner.partnerOnBoardingSteps,
			vehicle,
			docs,
			bank,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}
