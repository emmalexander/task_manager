import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'User first name is required'],
        trim: true,
        minLength: 2,
        maxLength: 55,
    },
    lastName: {
        type: String,
        required: [true, 'User last name is required'],
        trim: true,
        minLength: 2,
        maxLength: 55,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'User Phone number is required'],
        trim: true,
        match: [/^(?:0\d{10}|\+234\d{10})$/, 'Please enter a valid phone number. Examples: 09031887232 or +2349031887232'],
        maxLength: 14,
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;