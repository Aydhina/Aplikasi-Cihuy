const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema({
  id_kendaraan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Kendaraan',
    required: true
  },
  waktu_masuk: {
    type: Date,
    required: true
  },
  waktu_keluar: {
    type: Date,
  },
  id_tarif: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tarif',
    required: true
  },
  durasi_jam: { 
    type: Number,
  },
  biaya_total: { 
    type: Number,
  },
  status: {
    type: String,
    enum: ['masuk', 'keluar', 'batal'],
    default: 'masuk'
  },
  id_user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_area: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Area',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaksi', transaksiSchema);
