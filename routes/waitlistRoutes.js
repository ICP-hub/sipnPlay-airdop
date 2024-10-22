const express = require("express");
const {
  sendWaitlist,
  getWaitlist,
} = require("../controllers/waitlistController");
const authenticatePrincipal = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/sendWaitlist", sendWaitlist);
router.get("/getWaitlist", authenticatePrincipal, getWaitlist);

module.exports = router;
