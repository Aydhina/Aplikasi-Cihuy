const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  aktivitas: {
    type: String,
  },
  waktu_aktivitas: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);