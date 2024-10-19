const Message = require('../models/messageModel');

// Convert string date to MongoDB date format
const convertToMongoDate = (dateString) => {
  return new Date(dateString);
};

// POST to send message
exports.sendMessage = async (req, res) => {
  try {
    const { date, name, email, message } = req.body;
    const mongoDate = convertToMongoDate(date);

    const newMessage = new Message({
      date: mongoDate,
      name,
      email,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
