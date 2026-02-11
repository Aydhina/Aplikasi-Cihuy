const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
  nama_area: String,
  kapasitas: Number,
  terisi: {
    type: Number,
    default: 0,
  },
});

module.exports =
  mongoose.models.Area || mongoose.model("Area", areaSchema);
