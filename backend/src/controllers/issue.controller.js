import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Issue } from "../models/issue.model.js";
import { IssueMedia } from "../models/issue_media.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { 
  notifyReporter,
  notifyReporterOnStatusUpdate,
  notifyUsersOnResolution } from './notification.controller.js';

// Citizen creates issue
const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, lat, lng, address } = req.body;

  if (!title || !category || !lat || !lng) {
    throw new ApiError(400, "Missing required fields");
  }

  const issue = await Issue.create({
    userId: req.user._id,
    title,
    description,
    category,
    location: { lat, lng },
    address,
    media: [],
    reportedBy: req.user._id,
  });

  // Upload files to Cloudinary and save in IssueMedia
  const mediaIds = [];
  if (req.files?.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);

      const mediaDoc = await IssueMedia.create({
        issueId: issue._id,
        fileUrl: uploaded.url,
        mediaType: file.mimetype.startsWith("video") ? "video" : "image"
      });

      mediaIds.push(mediaDoc._id);
    }

    issue.media = mediaIds;
    await issue.save();
  }
  
  const {reportedBy, assignedTo = [] } = req.body;

    try {
        const issue = new Issue({
            title,
            description,
            reportedBy,
            assignedTo,
            status: 'reported',
            createdAt: new Date(),
        });

        await issue.save();

        // 🔔 Notify the reporter
        await notifyReporter(issue);

        res.status(201).json({ message: 'Issue created successfully', issue });
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }



  return res
    .status(201)
    .json(new ApiResponse(201, issue, "Issue reported successfully"));
});

// Delete the issue
const deleteIssue = asyncHandler(async (req, res) => {
  const { issueId } = req.params;

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  await Issue.findByIdAndDelete(issueId);

  res.status(200).json(new ApiResponse(200, null, "Issue deleted successfully"));
})

// Get all issues (admin dashboard)
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("userId", "fullName role")
    .populate("media"); // populate media objects
  return res.status(200).json(new ApiResponse(200, issues, "All issues fetched"));
});

// Get single issue
const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate("userId", "fullName role")
    .populate("media"); // populate media objects
  if (!issue) throw new ApiError(404, "Issue not found");
  return res.status(200).json(new ApiResponse(200, issue, "Issue fetched"));
});

// Update issue status
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!issue) throw new ApiError(404, "Issue not found");
  const { issueId } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ error: 'Issue not found' });

        issue.status = status;
        await issue.save();

        // 🔔 Notify reporter about status update
        await notifyReporterOnStatusUpdate(issue);

        if (status === 'resolved') {
            // 🔔 Notify everyone involved
            await notifyUsersOnResolution(issue);
        }

        res.status(200).json({ message: 'Status updated', issue });
    } catch (error) {
        console.error('Update issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  return res.status(200).json(new ApiResponse(200, issue, "Issue status updated"));
});

export { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssueStatus };
