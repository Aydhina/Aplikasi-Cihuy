const Log = require("../models/logModel");

const logController = {
  getLog: async (req, res) => {
    try {
      const logs = await Log.find()
        .populate("id_user", "nama_lengkap username role") 
        .sort({ waktu_aktivitas: -1 });

      res.render("logAktivitas", { logs });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan saat mengambil log");
    }
  },

  simpanLog: async (id_user, aktivitas) => {
    try {
      await Log.create({
        id_user,
        aktivitas,
      });
    } catch (error) {
      console.log("Gagal menyimpan log:", error);
    }
  },
};

module.exports = logController;