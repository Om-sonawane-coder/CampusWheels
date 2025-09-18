// server/models/Vehicle.js
const mongoose = require('mongoose');
const VehicleSchema = new mongoose.Schema({
  vehicleName: String,
  price: Number,
  year: Number,
  kms: Number,
  imageUrl: String,
  description: String,
  owner: { // <-- Yeh naya field add karo
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const VehicleModel = mongoose.model('Vehicle', VehicleSchema);
module.exports = VehicleModel;