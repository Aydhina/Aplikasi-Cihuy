const Log = require("../models/logModel");

const logController = {
  getLog: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20; // jumlah data per halaman
      const skip = (page - 1) * limit;

      const totalData = await Log.countDocuments();

      const logs = await Log.find()
        .populate("id_user", "nama_lengkap username role")
        .sort({ waktu_aktivitas: -1 })
        .skip(skip)
        .limit(limit);

      const totalPage = Math.ceil(totalData / limit);

      res.render("logAktivitas", {
        logs,
        currentPage: page,
        totalPage,
      });
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
