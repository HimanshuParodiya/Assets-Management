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

export { raiseTicket }