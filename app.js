const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
require("dotenv").config();
const app = express();

connectDB();

app.use(cors());

app.use(express.json());

// Routes
app.use("/api/messages", messageRoutes);
app.use("/api/waitlist", waitlistRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
