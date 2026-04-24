const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  productName: { type: String, default: 'Unknown Product' },
  imageUrl: { type: String, default: '' },
  barcodeNumber: { type: String, default: '' },
  fssaiNumber: { type: String, default: '' },
  fssaiStatus: { type: String, enum: ['valid', 'invalid', 'unverified'], default: 'unverified' },
  vegStatus: { type: String, enum: ['veg', 'nonVeg', 'unknown'], default: 'unknown' },
  nutritionData: {
    calories: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    saturatedFat: { type: Number, default: 0 },
    transFat: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
  },
  scores: {
    customScore: { type: Number, default: 0 },
    nutriScore: { type: String, default: 'C' },
    nutriGrade: { type: String, default: 'C' },
    japaneseGrade: { type: String, default: 'Fair' },
  },
  processingLevel: { type: String, default: 'Unknown' },
  additives: [{ type: String }],
  healthMode: { type: String, default: 'default' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scan', scanSchema);
