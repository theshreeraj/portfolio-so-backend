const User = require("../models/userModel");
const cloudinary = require("../service/cloudinaryConfig"); 
const multer = require('multer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Folder for temporary uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Preserve the file extension
    },
});

const upload = multer({ storage });

exports.createPortfolio = async (req, res) => {
    try {
        const { name, email, graduationYear, portfoliolink, linkedIn, description, experienceCategory, password } = req.body;

        // Files will now be in req.files, not req.body
        let portfolioHeroUrl = '';
        let profilePhotoUrl = '';

        // Check if portfolioHero file is present and upload to Cloudinary
        if (req.files && req.files.portfolioHero && req.files.portfolioHero[0]) {
            const resultHero = await cloudinary.uploader.upload(req.files.portfolioHero[0].path, { folder: 'portfolios' });
            portfolioHeroUrl = resultHero.secure_url;
        }

        // Check if profilePhoto file is present and upload to Cloudinary
        if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
            const resultProfile = await cloudinary.uploader.upload(req.files.profilePhoto[0].path, { folder: 'portfolios' });
            profilePhotoUrl = resultProfile.secure_url;
        }

        // Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new user with the provided data
        const newUser = new User({
            portfolioHero: portfolioHeroUrl,
            profilePhoto: profilePhotoUrl,
            name,
            email,
            password,
            graduationYear,
            portfoliolink,
            linkedIn,
            description,
            experienceCategory,
            role: "user", // Default role can be 'user'
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Return the response with the user and token
        res.status(201).json({
            message: "User created successfully",
            user: savedUser,
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating portfolio", error });
    }
};


// exports.createPortfolio = async (req, res) => {
//     try {
//         const {portfolioHero, profilePhoto, name, email, graduationYear, portfoliolink, linkedIn, description, experienceCategory, password } = req.body;

        

//         // Handle image uploads to Cloudinary
//         let portfolioHeroUrl = '';
//         let profilePhotoUrl = '';

//         if (portfolioHero) {
//             const resultHero = await cloudinary.uploader.upload(portfolioHero, { folder: 'portfolios' });
//             portfolioHeroUrl = resultHero.secure_url;
//         }

//         if (profilePhoto) {
//             const resultProfile = await cloudinary.uploader.upload(profilePhoto, { folder: 'portfolios' });
//             profilePhotoUrl = resultProfile.secure_url;
//         }

//         // Check if the user already exists by email
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists" });
//         }

//         // Create new user with hashed password
//         const newUser = new User({
//             portfolioHero: portfolioHeroUrl,
//             profilePhoto: profilePhotoUrl,
//             name,
//             email,
//             password,
//             graduationYear,
//             portfoliolink,
//             linkedIn,
//             description,
//             experienceCategory,
//             role: "user", // Default role can be 'user'
//         });

//         // Save the new user
//         const savedUser = await newUser.save();

//         // Generate JWT token
//         const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
//             expiresIn: '1d', // Adjust the token expiration as needed
//         });

//         // Return the JWT along with user details
//         res.status(201).json({
//             message: "User created successfully",
//             user: savedUser,
//             token: token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error creating portfolio", error });
//     }
// };



exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            public_id: `uploads/${req.file.filename}`,
        });

        res.status(200).json({
            message: "Image uploaded successfully",
            url: uploadResult.secure_url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading image", error });
    }
};



// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get users by experience category
exports.getUsersByCategory = async (req, res) => {
    try {
        const users = await User.find({ experienceCategory: req.params.experience });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
