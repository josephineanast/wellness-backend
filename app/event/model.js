const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  proposedDates: [Date],
  confirmedDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  remarks: {
    type: String,
  },
  confirmedDate: {
    type: Date,
  },
  proposedLocation: {
    postalCode: String,
    streetName: String,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
