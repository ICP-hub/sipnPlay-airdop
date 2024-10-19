const Waitlist = require('../models/waitlistModel');

// Convert string date to MongoDB date format
const convertToMongoDate = (dateString) => {
  return new Date(dateString);
};

// POST to send waitlist entry
exports.sendWaitlist = async (req, res) => {
  try {
    const { date, name, email, icpAddress } = req.body;
    const mongoDate = convertToMongoDate(date);

    const newWaitlist = new Waitlist({
      date: mongoDate,
      name,
      email,
      icpAddress,
    });

    await newWaitlist.save();
    res.status(201).json({ message: 'Waitlist entry sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all waitlist entries
exports.getWaitlist = async (req, res) => {
  try {
    const waitlistEntries = await Waitlist.find();
    res.status(200).json(waitlistEntries);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
