const mongoose = require('mongoose');

const kendaraanSchema = new mongoose.Schema({
  plat_nomor: {
    type: String,
    required: true
  },
  jenis_kendaraan: {
    type: String,
    required: true
  },
  warna: {
    type: String,
    required: true
  },
  pemilik: {
    type: String,
    required: true
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Kendaraan', kendaraanSchema);
