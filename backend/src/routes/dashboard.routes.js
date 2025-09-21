import { Router } from "express";
import { 
    getDashboardStats,
    getRecentIssues,
    getRecentNotifications,
    getIssuesByCategory
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get overall dashboard stats
router.get("/stats", verifyJWT, getDashboardStats);

// Get latest issues
router.get("/recent-issues", verifyJWT, getRecentIssues);

// Get latest notifications
router.get("/notifications", verifyJWT, getRecentNotifications);

// Get issues grouped by category
router.get("/issues-by-category", verifyJWT, getIssuesByCategory);

export default router;
