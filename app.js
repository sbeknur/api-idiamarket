const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

require("dotenv").config();

// Database connection
mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors()); // Enable CORS for all routes and origins
app.use(bodyParser.json());

// Routes
app.use("/api", require("./routes/productRoutes"));
app.use("/api", require("./routes/categoryRoutes"));
app.use("/api", require("./routes/colorRoutes"));
app.use("/api", require("./routes/stickerRoutes"));
app.use("/api", require("./routes/variantRoutes"));
app.use("/api", require("./routes/shortDescriptionRoutes"));
app.use("/api", require("./routes/seoMetadataRoutes"));
app.use("/api", require("./routes/attributeItemRoutes"));
app.use("/api", require("./routes/attributesRoutes"));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
