import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AIVerification } from "../models/aiVerification.model.js";
import { Issue } from "../models/issue.model.js";
import { IssueMedia } from "../models/issue_media.model.js"; 
import { User } from "../models/user.model.js";
import { ImageAnnotatorClient } from "@google-cloud/vision";

// Initialize the Google Vision Client
const visionClient = new ImageAnnotatorClient();

/**
 * Verify issue images using Google Vision API and auto-tag them.
 * Adds points to the user upon successful verification.
 */
const verifyIssueAI = asyncHandler(async (req, res) => {
    const { issueId } = req.params;

    const existingVerification = await AIVerification.findOne({ issueId });
    if (existingVerification && existingVerification.verified) {
        return res.status(200).json(new ApiResponse(
            200,
            existingVerification,
            "Issue already verified. No action taken."
        ));
    }

    // Check if the issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
        throw new ApiError(404, "Issue not found");
    }

    // Fetch related media directly from IssueMedia collection
    const mediaItems = await IssueMedia.find({ issueId });
    if (!mediaItems || mediaItems.length === 0) {
        throw new ApiError(404, "No media found for this issue");
    }

    // Array to hold verification results for all media
    const allMediaResults = [];

    // Process each media item
    for (const media of mediaItems) {
        const imageUrl = media.fileUrl;

        // Call Google Vision API for label detection
        const [result] = await visionClient.labelDetection(imageUrl);
        const labels = result.labelAnnotations;

        if (!labels || labels.length === 0) continue; // skip if no labels

        const tags = labels.map(label => label.description.toLowerCase());
        const primaryLabel = labels[0];

        allMediaResults.push({
            mediaId: media._id,
            url: imageUrl,
            confidenceScore: Math.round(primaryLabel.score * 100),
            tags: tags.slice(0, 5)
        });
    }

    if (allMediaResults.length === 0) {
        throw new ApiError(500, "AI could not verify any media for this issue.");
    }

    // Store or update AI verification in DB (one document per issue)
    const verification = await AIVerification.findOneAndUpdate(
        { issueId },
        {
            issueId,
            verified: true,
            mediaResults: allMediaResults
        },
        { new: true, upsert: true }
    );

    // Add points to the user after successful AI verification
    const pointsToAdd = 50;
    const user = await User.findById(req.user._id);
    if (user) {
        user.points = (user.points || 0) + pointsToAdd;
        await user.save();
    }

    return res.status(201).json(new ApiResponse(
        201,
        { verification, pointsAdded: pointsToAdd },
        "AI verification and tagging completed successfully, points added"
    ));
});

/**
 * Get AI verification result for an issue
 */
const getVerificationResult = asyncHandler(async (req, res) => {
    const { issueId } = req.params;
    const verification = await AIVerification.findOne({ issueId });

    if (!verification) {
        throw new ApiError(404, "No verification result found for this issue");
    }

    return res.status(200).json(new ApiResponse(
        200,
        verification,
        "AI verification result fetched successfully"
    ));
});

export { verifyIssueAI, getVerificationResult };
