import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: [true, "Please provide a ticket ID"],
        unique: true,
        trim: true,
        index: true

    },
    assetId: {
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


// Error handling middleware
// ticketSchema.pre("save", (error, doc, next) => {
//     if (error.name === "MongoError" && error.code === 11000) {
//         next(new Error("Duplicate ticket ID. Please provide a unique ticket ID."));
//     } else {
//         next(error);
//     }
// });

const MaintenanceTicket = mongoose.model('MaintenanceTicket', ticketSchema);

export default MaintenanceTicket;
