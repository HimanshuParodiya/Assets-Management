import mongoose from "mongoose";
import Counter from "./counter.model.js";

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: [true, "Please provide a ticket ID"],
        unique: true,
        trim: true,
        index: true

    },
    motorId: {
        type: String,
        required: [true, "Please provide an asset ID"],
        trim: true,
    },
    issueDescription: {
        type: String,
        required: [true, "Please provide an issue description"],
        trim: true
    },
    dateRaised: {
        type: Date,
        required: [true, "Please provide a date raised"]
    },
    status: {
        type: String,
        required: [true, "Please provide a status"],
        enum: ["Open", "In Progress", "Resolved"]
    }
});


// Automatically generate the ticketId before saving a new ticket.

ticketSchema.pre('save', async function (next) {
    // If the ticket is not new, go to the next middleware
    if (!this.isNew) {
        return next();
    }
    // find and update the counter model
    const counter = await Counter.findByIdAndUpdate(
        { _id: 'ticketId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    // update ticket id
    this.ticketId = `TCK-${counter.seq}`;
    next();
});




const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
