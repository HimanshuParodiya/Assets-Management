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
const getAllAssets = asyncHandler(async (req, res) => {
    // Fetch all tickets from the database
    const assets = await Asset.find();

    // Return the tickets as a response
    res.status(200).json(new ApiResponse(200, assets, "Assets retrieved successfully"));
});

const updateAssetDetails = asyncHandler(async (req, res) => {
    // store the update assets id 
    const assetId = req.params.id;
    // get data from params
    const {
        motorId, name, description, location, manufacturer, modelNumber, serialNumber,
        installationDate, lastMaintenanceDate, status, power, voltage, current, speed
    } = req.body;

    // Find the asset to update
    const asset = await Asset.findById(assetId);
    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    // Prepare the fields to be updated
    const updateFields = {};
    if (motorId) updateFields.motorId = motorId;
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (location) updateFields.location = location;
    if (manufacturer) updateFields.manufacturer = manufacturer;
    if (modelNumber) updateFields.modelNumber = modelNumber;
    if (serialNumber) updateFields.serialNumber = serialNumber;
    if (installationDate) {
        const parsedInstallationDate = parse(installationDate, 'dd-MM-yyyy', new Date());
        if (!isValid(parsedInstallationDate)) {
            throw new ApiError(400, 'Invalid date format for installationDate. Use dd-MM-yyyy.');
        }
        updateFields.installationDate = parsedInstallationDate;
    }
    if (lastMaintenanceDate) {
        const parsedLastMaintenanceDate = parse(lastMaintenanceDate, 'dd-MM-yyyy', new Date());
        if (!isValid(parsedLastMaintenanceDate)) {
            throw new ApiError(400, 'Invalid date format for lastMaintenanceDate. Use dd-MM-yyyy.');
        }
        updateFields.lastMaintenanceDate = parsedLastMaintenanceDate;
    }
    if (status) updateFields.status = status;

    // Validate and prepare specifications if provided
    if (power || voltage || current || speed) {
        updateFields.specifications = {
            ...(power && { power }),
            ...(voltage && { voltage }),
            ...(current && { current }),
            ...(speed && { speed }),
        };
    }

    // Update the asset in the database
    const updatedAsset = await Asset.findByIdAndUpdate(assetId, { $set: updateFields }, { new: true });

    // Return the updated asset
    return res.status(200).json(new ApiResponse(200, updatedAsset, "Asset details updated successfully"));
});

const deleteAsset = asyncHandler(async (req, res) => {
    // get the id which needs to be deleted
    const assetId = req.params.id;

    // find the asset and delete
    const asset = await Asset.findByIdAndDelete(assetId);

    // handle case where asset is not found
    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    // return response
    res.status(200).json(new ApiResponse(200, asset, "Asset deleted successfully"));
});

const getAssetDetails = asyncHandler(async (req, res) => {
    // Extract the asset ID from the request parameters
    const { id } = req.params;

    try {
        // Use Mongoose to find the asset by its ID
        const asset = await Asset.findById(id);

        // If the asset is not found, return a 404 error response
        if (!asset) {
            return res.status(404).json(new ApiResponse(404, null, "Asset not found"));
        }

        // If the asset is found, return it in the response
        res.status(200).json(new ApiResponse(200, asset, "Asset details retrieved successfully"));
    } catch (error) {
        // If an error occurs, return a 500 error response
        res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});

export { addAsset, getAllAssets, updateAssetDetails, deleteAsset, getAssetDetails }