const Tarif = require("../models/tarifModel");
const { simpanLog } = require("./logAktivitasController");

const tarifController = {
  getDaftarTarif: async (req, res) => {
    try {
      const tarif = await Tarif.find();
      res.render("daftarTarif", { tarif });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  getTambahTarif: (req, res) => {
    res.render("tambahTarif");
  },

  tambahTarif: async (req, res) => {
    try {
      const { jenis_kendaraan, tarif_per_jam } = req.body;

      await Tarif.create({
        jenis_kendaraan,
        tarif_per_jam,
      });

      await simpanLog(
        req.session.user.id,
        `Menambah tarif baru untuk ${jenis_kendaraan}`,
      );

      res.redirect("/tarif/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menambah tarif");
    }
  },

  getEditTarif: async (req, res) => {
    try {
      const tarif = await Tarif.findById(req.params.id);
      res.render("editTarif", { tarif });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  editTarif: async (req, res) => {
    try {
      const { jenis_kendaraan, tarif_per_jam } = req.body;

      await Tarif.findByIdAndUpdate(req.params.id, {
        jenis_kendaraan,
        tarif_per_jam,
      });

      await simpanLog(req.session.user.id, `Mengedit tarif ${jenis_kendaraan}`);

      res.redirect("/tarif/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal mengedit tarif");
    }
  },

  deleteTarif: async (req, res) => {
    try {
      await Tarif.findByIdAndDelete(req.params.id);

      await simpanLog(
        req.session.user.id,
        `Menghapus tarif ${tarif ? tarif.jenis_kendaraan : req.params.id}`,
      );

      res.redirect("/tarif/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menghapus tarif");
    }
  },
};

module.exports = tarifController;
