const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama_lengkap: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'petugas', 'owner'], 
    required: true
  },
  status_aktif: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('User', userSchema);