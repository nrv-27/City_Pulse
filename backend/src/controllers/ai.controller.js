import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AIVerification } from "../models/aiVerification.model.js";
import { Issue } from "../models/issue.model.js"; // 💡 Assuming you have an Issue model to get the image URL
import { ImageAnnotatorClient } from "@google-cloud/vision";

// Initialize the Google Vision Client
const visionClient = new ImageAnnotatorClient();

/**
 * 💡 IMPORTANT: Model Update
 * Your AIVerification model should be updated to store the tags.
 * * export const aiVerificationSchema = new Schema({
 * issueId: { type: Schema.Types.ObjectId, ref: "Issue", required: true, index: true },
 * verified: { type: Boolean, default: false },
 * confidenceScore: { type: Number },
 * tags: { type: [String] } // ✨ Add this field to your schema
 * }, { timestamps: true });
 */


// ✅ Run AI verification and auto-tagging using Google Vision API
const verifyIssueAI = asyncHandler(async (req, res) => {
    const { issueId } = req.params;

    // 1. Fetch the issue to get the image URL
    const issue = await Issue.findById(issueId);
    if (!issue || !issue.imageUrl) {
        throw new ApiError(404, "Issue or issue image not found");
    }

    // 2. Call Google Vision API for label detection (auto-tagging)
    const [result] = await visionClient.labelDetection(issue.imageUrl);
    const labels = result.labelAnnotations;

    if (!labels || labels.length === 0) {
        throw new ApiError(500, "AI could not verify the image.");
    }
    
    // 3. Process the results
    const tags = labels.map(label => label.description.toLowerCase());
    const primaryLabel = labels[0]; // The first label is usually the most confident one

    // 4. Create or update the verification document in the database
    // Using findOneAndUpdate with upsert is robust: it creates if not exists, updates if it does.
    const verification = await AIVerification.findOneAndUpdate(
        { issueId: issueId },
        {
            issueId,
            verified: true,
            confidenceScore: Math.round(primaryLabel.score * 100), // Convert score (0-1) to percentage (0-100)
            tags: tags.slice(0, 5) // Store the top 5 relevant tags
        },
        { new: true, upsert: true } // `upsert: true` creates a new doc if none is found
    );

    return res
        .status(201)
        .json(new ApiResponse(201, verification, "AI verification and tagging completed successfully"));
});


// ✅ Get AI result
const getVerificationResult = asyncHandler(async (req, res) => {
    const { issueId } = req.params;
    const verification = await AIVerification.findOne({ issueId });

    if (!verification) {
        throw new ApiError(404, "No verification result found for this issue");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, verification, "AI verification result fetched successfully"));
});

export { verifyIssueAI, getVerificationResult };