const Message = require("../models/messageModel");

// Convert string date to MongoDB date format

// POST to send message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({
      date: new Date(),
      name,
      email,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
