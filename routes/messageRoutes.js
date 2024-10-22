const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const authenticatePrincipal = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/sendMessage", sendMessage);
router.get("/getMessages", authenticatePrincipal, getMessages);

module.exports = router;
