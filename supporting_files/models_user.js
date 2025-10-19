const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const recoveryCodeSchema = new mongoose.Schema({
  code: {type: String, required: true},
  used: { type: Boolean, default: false }
}, { _id : false});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        
    },
     name: {
        type: String,
        
    },
    hash: String,
    salt: String,

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret:  { type: String, default: '' },
    recoveryCodes:    { type: [recoveryCodeSchema], default: [] },

    //*** added for role-based access control ***
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user' },

    pastTrips: {type: [String], default: [] }, // Array of past trip codes

});

mongoose.model('User', userSchema);

// Method to set the password on this record.
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
      1000, 64, 'sha512').toString('hex');
}; 

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
      this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}; 

// Method to generate a JSON Web Token for the current user record

userSchema.methods.generateJWT = function() {
  // set token to expire in 7 days
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); 

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,               // User's role (admin or user)
      exp: Math.floor(expiry.getTime() / 1000) // JWT exp is in seconds
    },
    process.env.JWT_SECRET
  );
}; 



module.exports = mongoose.model('users', userSchema);
