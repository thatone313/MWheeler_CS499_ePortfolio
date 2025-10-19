const express = require('express'); // Express app
const router = express.Router(); // Router logic
const Trip = require("../models/travlr"); // Import Trip model
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens
const rateLimit = require('express-rate-limit'); // Rate limiting middleware
const { ipKeyGenerator } = require('express-rate-limit'); // IP key generator for rate limiting
const usersController = require('../controllers/users'); 


// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');
const user = require('../models/user');

//apply the rate limiting middleware to all requests
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: 'draft-7', // send rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {message: 'Too many login attemps, please try again later.'},
  keyGenerator: (req,) => {
    const email = (req.body?.email || '').toLowerCase().trim(); // Use email from request body or empty string
    return email || ipKeyGenerator(req); // Use email as the key for rate limiting
  },

  skipSuccessfulRequests: false // Count all requests, including successful ones
});


// Define route for register
router
  .route("/register")
  .post(authController.register); // POST method to register a user

// Define route for trips endpoint
//Protected route, only accessible to admin users
router
  .route('/trips')
  .get(tripsController.tripsList) // GET method routes tripList
  .post(authenticateJWT, ensureAdmin, tripsController.tripsAddTrip); // POST Method Adds a Trip

// GET Method routes tripsFindByCode - requires parameter
// PUT method routes tripsUpdateTrip - requires parameter
//Protected route, only accessible to admin users
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, ensureAdmin, tripsController.tripsUpdateTrip);

// Define route for login endpoint
router
  .route('/login')
  .post(loginLimiter, authController.login);


// Returns a list of trips similar to the given tripCode based on shared words in name, resort, and description.
router
  .route('/trips/:tripCode/recommendations')
  .get(tripsController.tripsRecommendSimilar);

  // User routes for trip history and recommendations
router
  .route('/users/me/history/:tripCode')
  .post( authenticateJWT, usersController.addHistory);

router
  .route('/users/me/recommendations')
  .get(authenticateJWT, usersController.recommendForUser);

// DELETE /api/trips/:tripCode
//Protected route, only accessible to admin users
router.delete('/trips/:tripCode', authenticateJWT, ensureAdmin, async (req, res) => {
  try {
    const codeParam = String(req.params.tripCode || '').trim();          
    const trip = await Trip.findOne({ code: codeParam });                // Find trip by code
    if (!trip) {
      return res.status(404).json({ message: `Trip not found for code '${codeParam}'` }); // 404 if not found
    }
    await Trip.deleteOne({ _id: trip._id });                             
    return res.status(200).json({ message: 'Trip deleted', code: trip.code }); // 200 if deleted successfully
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});


// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader == null) {
    console.log('Auth Header Required but NOT PRESENT!');
    return res.sendStatus(401);
  }

  let headers = authHeader.split(' ');
  if (headers.length < 1) {
    console.log('Not enough tokens in Auth Header: ' + headers.length);
    return res.sendStatus(501);
  }

  const token = authHeader.split(' ')[1];
  if (token == null) {
    console.log('Null Bearer Token');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      return res
        .status(401)
        .json('Token Validation Error!');
    }
    req.auth = verified; // Set the auth param to the decoded object
    next(); // Continue to the next middleware or route handler
  });
}

// Middleware to ensure the user is an admin
function ensureAdmin(req, res, next) {           
  if (req.auth && req.auth.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Admin privileges required' });
}

// DEBUG: list registered routes/methods
router.get('/_routes', (req, res) => {
  const out = [];
  router.stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      out.push(`${methods} ${layer.route.path}`);
    }
  });
  res.json(out);
});
module.exports = router;