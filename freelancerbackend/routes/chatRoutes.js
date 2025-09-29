const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

// List eligible chats (projects where this user can chat)
router.get("/eligible", authenticateToken, chatController.getEligibleChats);

// Get chat history for a project
router.get("/:projectId/history", authenticateToken, chatController.getHistory);

// Send a message in a project chat
router.post("/:projectId/send", authenticateToken, chatController.sendMessage);

module.exports = router;
