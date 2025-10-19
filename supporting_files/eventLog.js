const mongoose = require("mongoose");


const eventLogSchema = new mongoose.Schema({
    when: { type: Date, default: Date.now }, // Timestamp of the event
    type: { type: String, required: true }, // Type of event (e.g., 'login', 'register')
    actorEmail: { type: String}, // Email of the user who performed the action
    actorRole: { type: String }, // Role of the user (e.g., 'admin', 'user')
    ip: { type: String }, // IP address of the user
    route: { type: String }, // API route accessed
    details: { type: Object } // Additional details about the event
});

// Create and export the EventLog model
module.exports = mongoose.model("EventLog", eventLogSchema);