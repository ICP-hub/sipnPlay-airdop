const Waitlist = require("../models/waitlistModel");
const { getCurrentTimeString } = require('../utils/dateUtils');

exports.sendWaitlist = async (req, res) => {
  try {
    const { name, email, icpAddress } = req.body;

    const newWaitlist = new Waitlist({
      date:  getCurrentTimeString(),
      name,
      email,
      icpAddress,
    });

    await newWaitlist.save();
    res.status(201).json({ message: "Waitlist entry sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET all waitlist entries
exports.getWaitlist = async (req, res) => {
  try {
    const waitlistEntries = await Waitlist.find();
    res.status(200).json({ data: waitlistEntries });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
