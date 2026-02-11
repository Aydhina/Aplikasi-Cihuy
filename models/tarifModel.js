const mongoose = require("mongoose");

const tarifSchema = new mongoose.Schema({
  jenis_kendaraan: {
    type: String,
    enum: ['motor', 'mobil'],
    required: true
  },
  tarif_per_jam: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Tarif', tarifSchema);
