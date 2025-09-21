import { asyncHandler } from "../utils/asyncHandler.js";
import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { getUserNotifications } from "./notification.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Get overall dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });
        const pendingIssues = await Issue.countDocuments({ status: "Pending" });
        const inProgress = await Issue.countDocuments({ status: "In Progress" });

        // const totalUsers = await User.countDocuments();
        // const totalAdmins = await User.countDocuments({ role: "Admin" });

        return res.status(200).json(
            new ApiResponse(200, {
                totalIssues,
                resolvedIssues,
                pendingIssues,
                inProgress,
                // totalUsers,
                // totalAdmins
            }, "Dashboard statistics fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch dashboard stats");
    }
});

// Recent issues (for dashboard list)
export const getRecentIssues = asyncHandler(async (req, res) => {
    console.log("Fetching recent issues...");
    const issues = await Issue.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("reportedBy", "username email");

    console.log("Found issues:", issues.length);
    return res.status(200).json({ issues });
});

// Recent notifications
export const getRecentNotifications = asyncHandler(async (req, res, next) => {
  // Fake a req.params.userId for getUserNotifications since it expects that
  req.params.userId = req.user._id;

  // Call the notification controller function directly
  await getUserNotifications(req, res, next);
});

// Category breakdown (for pie chart)
export const getIssuesByCategory = asyncHandler(async (req, res) => {
    try {
        const categories = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        return res.status(200).json(
            new ApiResponse(200, categories, "Issues by category fetched successfully")
        );
    } catch (err) {
        throw new ApiError(500, "Failed to fetch category stats");
    }
});

