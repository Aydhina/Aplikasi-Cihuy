const Kendaraan = require('../models/kendaraanModel');
const { simpanLog } = require('./logAktivitasController');

const kendaraanController = {

  getDaftarKendaraan: async (req, res) => {
    try {
      const kendaraan = await Kendaraan.find();
      res.render('daftarKendaraan', { kendaraan });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  getTambahKendaraan: (req, res) => {
    res.render('tambahKendaraan');
  },

  tambahKendaraan: async (req, res) => {
    try {
      const { plat_nomor, jenis_kendaraan, warna, pemilik } = req.body;

      await Kendaraan.create({
        plat_nomor,
        jenis_kendaraan,
        warna,
        pemilik,
        id_user: req.session.user.id
      });

      await simpanLog(req.session.user.id, "Menambah kendaraan");

      res.redirect('/kendaraan/daftar');
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menambah kendaraan");
    }
  },

  getEditKendaraan: async (req, res) => {
    try {
      const kendaraan = await Kendaraan.findById(req.params.id);
      res.render('editKendaraan', { kendaraan });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  editKendaraan: async (req, res) => {
    try {
      const { plat_nomor, jenis_kendaraan, warna, pemilik } = req.body;

      await Kendaraan.findByIdAndUpdate(req.params.id, {
        plat_nomor,
        jenis_kendaraan,
        warna,
        pemilik
      });

      await simpanLog(req.session.user.id, "Mengedit kendaraan");

      res.redirect('/kendaraan/daftar');
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal mengedit kendaraan");
    }
  },

  deleteKendaraan: async (req, res) => {
    try {
      await Kendaraan.findByIdAndDelete(req.params.id);

      await simpanLog(req.session.user.id, "Menghapus kendaraan");

      res.redirect('/kendaraan/daftar');
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menghapus kendaraan");
    }
  }
};

module.exports = kendaraanController;
