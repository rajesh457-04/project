const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let Registeruser = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});


Registeruser.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next(); 
        }
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
        next();
    } catch (err) {
        next(err); 
    }
});



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  profilePicture: { type: String },
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Registeruser', Registeruser);
