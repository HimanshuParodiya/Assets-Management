import Asset from "../models/asset.model.js";
import Ticket from "../models/ticket.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isValid, parse } from "date-fns";

const raiseTicket = asyncHandler(async (req, res) => {
    const { motorId, issueDescription, dateRaised, status } = req.body;

    // Validate required fields
    if (!motorId || !issueDescription || !dateRaised || !status) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the motorId exists in the database
    const asset = await Asset.findOne({ motorId });
    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    // Parse the dateRaised string into a Date object
    const parsedDateRaised = parse(dateRaised, 'dd-MM-yyyy', new Date());
    if (!isValid(parsedDateRaised)) {
        throw new ApiError(400, 'Invalid date format for dateRaised. Use dd-MM-yyyy.');
    }
    const existedTicket = await Ticket.findOne({ motorId: motorId });
    if (existedTicket) {
        throw new ApiError(409, "Ticket for this motor is already raised");
    }
    // Generate a ticketId in the format of TCK-<number>
    const ticketCount = await Ticket.countDocuments();
    const ticketId = `TCK-${ticketCount + 1}`;

    // Create and save the ticket
    const ticket = new Ticket({
        ticketId,
        motorId,
        issueDescription,
        dateRaised: parsedDateRaised,
        status
    });

    await ticket.save();

    res.status(201).json(new ApiResponse(201, ticket, "Ticket raised successfully"));
});
const updateTicket = asyncHandler(async (req, res) => {
    // Get the ticket id which needs to be updated
    const ticketId = req.params.id;

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    // If ticket does not exist, throw an error
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }
    // Get the update fields from the request body
    const { dateRaised, status, ...updates } = req.body;
    // Validate the status field
    const validStatusValues = ["Open", "In Progress", "Resolved"];
    if (status && !validStatusValues.includes(status)) {
        throw new ApiError(400, "Invalid status value. Status must be one of: Open, In Progress, Resolved");
    }
    // Parse the dateRaised string into a Date object
    const parsedDateRaised = parse(dateRaised, 'dd-MM-yyyy', new Date());

    // Update the fields provided in the request body
    Object.keys(updates).forEach((key) => {
        ticket[key] = updates[key];
    });

    // Set the parsed dateRaised
    ticket.dateRaised = parsedDateRaised;

    // Save the updated ticket
    await ticket.save({ validateBeforeSave: true });

    // Return the updated ticket as a response
    res.status(200).json(new ApiResponse(200, ticket, "Ticket updated successfully"));
});


const deleteTicket = asyncHandler(async (req, res) => {
    // get the id which needs to be deleted
    const ticketId = req.params.id;

    // find the asset and delete
    const ticket = await Ticket.findByIdAndDelete(ticketId);

    // handle case where asset is not found
    if (!ticket) {
        throw new ApiError(404, "Asset not found");
    }

    // return response
    res.status(200).json(new ApiResponse(200, ticket, "Asset deleted successfully"));
});


export { raiseTicket, updateTicket, deleteTicket }