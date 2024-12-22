const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    portfolioHero: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    graduationYear: {
        type: Date,
    },
    portfoliolink: {
        type: String,
    },
    linkedIn: {
        type: String,
    },
    description: {
        type: String,
    },
    experienceCategory: {
        type: String,
        enum: ['0-1 year', '1-2 years', '2-5 years', '5+ years'],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'recruiter'],
        default: 'user',
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
    status: [{
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    }],
}, {
    timestamps: true,
});

// Password hashing before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
