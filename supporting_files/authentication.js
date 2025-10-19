const mongoose = require('mongoose');
const User = require('../models/user');
const EventLog = require('../models/eventLog'); // Event log model
const passport = require('passport');
const speakeasy = require('speakeasy'); // For 2FA 

async function logEvent(type, req, user = {}, details = {}) {
  try {
    await EventLog.create({
      type,
      actorEmail: user.email || (req.body && req.body.email) || 'unknown',
      actorRole: user.role || 'unknown',
      ip: req.ip,
      route: req?.originalUrl,
      details
    });
  }
  catch (err) {
    console.error('Error logging event:', err.message);
  }
}

const register = async (req, res) => {
    //Validate message to insure that all parameters are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
        .status(400)
        .json({ message: 'All fields required.' });
    }

    const user = new User(
        {
            name: req.body.name,          //Set user name
            email: req.body.email,        //Set  e-mail address
            password: ''                  //Start with empty password
        });
    user.setPassword(req.body.password); // Set user password

    try {
      const q = await user.save(); // Save user to database

      if (!q) { //Database returned no data
        //Database returned no data
        return res
            .status(400)
            .json({ message: 'Error creating user.' });
      } 
    
        //return new user token
        const token = user.generateJWT(); // Generate JSON Web Token
        console.log(`[REGISTER SUCCESS] User ${user.email} logged in at ${new Date().toISOString()}`);
        
        await logEvent('register_ success', req, user, { message: 'User registered successfully' }); // Log registration event
        return res
            .status(200)
            .json({ token }); // Return token to client
    }
     catch (err) {
      await logEvent('register_failed', req, user, { error: err.message }); // Log failed registration attempt
      return res
        .status(400)
        .json({message: 'Register failed', error: err });
    } 
};

const login = (req, res) => {
    // Validate message to ensure that email and password are present.
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({"message": "All fields required"});
    }

    // Delegate authentication  to passport module
    passport.authenticate('local', async(err, user, info) => {
      if (err) {
        // Error in Authentication Process
        return res
          .status(404)
          .json(err);
      }
      
       if (!user) { // Auth failed return error
        await logEvent('login_failed', req, {}, { // Log failed login attempt
          reason: info?.message || 'invalid credentials',
          actorEmail: (req.body.email || '').toLowerCase() 
        });
        return res
          .status(401)
          .json(info);
      }
      
      try { // Auth succeeded - generate JWT and return to caller
        if (user.twoFactorEnabled) { // 2FA is enabled for this user
          const otp = (req.body.otp || '').trim(); // Get OTP from request body
          const recoveryCode = (req.body.recoveryCode || '').trim(); // Get recovery code from request body
          
          if (!otp && !recoveryCode) { // Neither OTP nor recovery code was provided
            await logEvent('login_failed', req, { // Log failed login attempt
              reason: '2FA required but not provided',
              actorEmail: user.email,
        });
            return res
              .status(401)
              .json({ message: 'Two-factor authentication code or recovery code required' });
          }
          
          
            let secondFactorOk = false;

          if (otp) { // OTP provided - verify it
            try {
            const verified = speakeasy.totp.verify({
              secret: user.twoFactorSecret,
              encoding: 'base32',
              token: otp,
              window: 1 // Allow a 30 second window before or after
            });

            //console.log(`[2FA] Verify result:`, verified, 'serverNow:', serverNow,);

            secondFactorOk = !!verified;
          }
          catch (e) {
            console.error('2FA OTP verify exception:', e);
          }
          }

        if (!secondFactorOk && recoveryCode && Array.isArray(user.recoveryCodes)) { // OTP was not valid, but recovery code was provided
          const norm = s => String(s || '').trim().toUpperCase();  
          const rcIndex = user.recoveryCodes.findIndex(rc => rc && rc.used === false 
            && norm(rc.code) === norm(recoveryCode ));
    
          if (rcIndex >= 0) { // Found a matching recovery code
            user.recoveryCodes[rcIndex].used = true; // Mark this code as used
            secondFactorOk = true;
            await user.save(); // Save the user record
          }
    
            }
          if (!secondFactorOk) { // Neither OTP nor recovery code was valid
            await logEvent('login_failed', req, user, { // Log failed login attempt
              reason: 'invalid 2FA code or recovery code',
              actorEmail: user.email,
            });
            return res
              .status(401)
              .json({ message: 'Invalid two-factor authentication code or recovery code' });
          } 
        } // End of 2FA check

        const token = user.generateJWT(); // Generate JSON Web Token
        await logEvent('login_success', req, user, { message: 'User logged in successfully' }); // Log successful login
        return res
          .status(200)
          .json({ token }); // Return token to caller
      }

      catch(err) {
        console.error('2FA Login error:', err);
        return res
          .status(500)
          .json({ message: 'Internal server error' });
      };
    })(req, res);
};



// Export methods that drive endpoints.
module.exports = {
    register,
    login
     
};