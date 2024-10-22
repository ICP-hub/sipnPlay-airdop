const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", messageSchema);
