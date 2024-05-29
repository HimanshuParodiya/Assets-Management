import asyncHandler from "../utils/asyncHandler.js";

const raiseTicket = asyncHandler(async (req, res) => {
    res.status(200)
        .json({
            message: "ticket raised successfully"
        })
})

export { raiseTicket }