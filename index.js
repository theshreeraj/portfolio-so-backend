const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
 
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve static uploads folder

// Database connection
connectDB();

// Default route
app.get('/', (req, res) => {
    res.send("<h1>Hello From Server</h1>");        
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
