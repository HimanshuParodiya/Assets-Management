import asyncHandler from "../utils/asyncHandler.js";

const addAsset = asyncHandler(async (req, res) => {
    res.status(200)
        .json({
            message: "Asset added successfully"
        })
})

export { addAsset }