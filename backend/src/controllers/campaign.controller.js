import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Campaign } from "../models/campaign.model.js";
import { User } from "../models/user.model.js";

// Create a new campaign
const createCampaign = asyncHandler(async (req, res) => {
  const { campaignName, campaignDate, campaignStatus, pointsAddedAfterJoining } = req.body;

  const campaign = await Campaign.create({
    campaignName,
    campaignDate,
    campaignStatus,
    pointsAddedAfterJoining: pointsAddedAfterJoining || 0
  });

  res.status(201).json(new ApiResponse(201, campaign, "Campaign created successfully"));
});

// Get all campaigns
const getAllCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find().populate("participants", "name email");
  res.status(200).json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
});

// Get single campaign
const getCampaignById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findById(id).populate("participants", "name email");
  if (!campaign) throw new ApiError(404, "Campaign not found");

  res.status(200).json(new ApiResponse(200, campaign, "Campaign fetched successfully"));
});

// Join a campaign
const joinCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const userId = req.user._id;

  const campaign = await Campaign.findById(id);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  // Check if already joined
  if (campaign.participants.includes(userId)) {
    return res.status(400).json(new ApiResponse(400, null, "User already joined this campaign"));
  }

  // Add user to participants
  campaign.participants.push(userId);
  await campaign.save();

  // Add points to user
  const user = await User.findById(userId);
  user.points = (user.points || 0) + campaign.pointsAddedAfterJoining;
  await user.save();

  res.status(200).json(new ApiResponse(200, campaign, "Successfully joined campaign and points added"));
});

// Update campaign status
const updateCampaignStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { campaignStatus } = req.body;

  const campaign = await Campaign.findById(id);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  campaign.campaignStatus = campaignStatus;
  await campaign.save();

  res.status(200).json(new ApiResponse(200, campaign, "Campaign status updated successfully"));
});

// Delete campaign
const deleteCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campaign = await Campaign.findByIdAndDelete(id);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  res.status(200).json(new ApiResponse(200, null, "Campaign deleted successfully"));
});

export {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  joinCampaign,
  updateCampaignStatus,
  deleteCampaign
};
