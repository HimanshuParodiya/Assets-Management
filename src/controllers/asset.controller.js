import { parse, isValid } from "date-fns";
import Asset from "../models/asset.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const addAsset = asyncHandler(async (req, res) => {
    // Get the data from the body
    const {
        motorId, name, description, location, manufacturer, modelNumber, serialNumber,
        installationDate, lastMaintenanceDate, status, power, voltage, current, speed
    } = req.body;

    // Validate fields
    if ([motorId, name, manufacturer, modelNumber, serialNumber, installationDate, lastMaintenanceDate, status].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // Validate specifications
    const specifications = { power, voltage, current, speed };
    if ([power, voltage, current, speed].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    // Parse installationDate and lastMaintenanceDate
    const parsedInstallationDate = parse(installationDate, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedInstallationDate)) {
        throw new ApiError(400, 'Invalid date format for installationDate. Use dd-MM-yyyy.');
    }

    const parsedLastMaintenanceDate = parse(lastMaintenanceDate, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedLastMaintenanceDate)) {
        throw new ApiError(400, 'Invalid date format for lastMaintenanceDate. Use dd-MM-yyyy.');
    }

    // Check if the asset already exists
    const existedAsset = await Asset.findOne({ $or: [{ motorId }, { serialNumber }] });
    if (existedAsset) {
        throw new ApiError(409, "Asset with motorId or serialNumber already exists");
    }

    // Create asset in the database
    const asset = await Asset.create({
        motorId,
        name,
        description,
        location,
        manufacturer,
        modelNumber,
        serialNumber,
        installationDate: parsedInstallationDate,
        lastMaintenanceDate: parsedLastMaintenanceDate,
        status,
        specifications: [specifications]
    });

    // Check for asset creation
    const createdAsset = await Asset.findById(asset._id);
    if (!createdAsset) {
        throw new ApiError(500, "Something went wrong while adding the asset");
    }

    // Return response
    return res.status(201).json(new ApiResponse(201, createdAsset, "Asset added successfully"));
});

export { addAsset };
