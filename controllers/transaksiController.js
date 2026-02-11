const Transaksi = require("../models/transaksiModel");
const Kendaraan = require("../models/kendaraanModel");
const Tarif = require("../models/tarifModel");
const AreaParkir = require("../models/areaModel");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const { simpanLog } = require("./logAktivitasController");

const transaksiController = {
  getDaftarTransaksi: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const search = req.query.search || "";
      const sort = req.query.sort || "terbaru";

      // FILTER SEARCH (plat nomor)
      let filter = {};
      if (search) {
        const kendaraan = await Kendaraan.find({
          plat_nomor: { $regex: search, $options: "i" },
        });

        filter.id_kendaraan = { $in: kendaraan.map((k) => k._id) };
      }

      // SORTING
      let sortQuery = {};
      if (sort === "terbaru") sortQuery.waktu_masuk = -1;
      if (sort === "terlama") sortQuery.waktu_masuk = 1;
      if (sort === "termahal") sortQuery.biaya_total = -1;

      const totalData = await Transaksi.countDocuments(filter);

      const transaksi = await Transaksi.find(filter)
        .populate("id_kendaraan")
        .populate("id_tarif")
        .populate("id_area")
        .populate("id_user")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

      const totalPage = Math.ceil(totalData / limit);

      res.render("daftarTransaksi", {
        transaksi,
        role: req.session.user.role,
        currentPage: page,
        totalPage,
        search,
        sort,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  getTambahTransaksi: async (req, res) => {
    const kendaraan = await Kendaraan.find();
    const tarif = await Tarif.find();
    const area = await AreaParkir.find();

    res.render("tambahTransaksi", { kendaraan, tarif, area });
  },

  tambahTransaksi: async (req, res) => {
    try {
      const { id_kendaraan, id_tarif, id_area } = req.body;

      await Transaksi.create({
        id_kendaraan,
        id_tarif,
        id_area,
        waktu_masuk: new Date(),
        id_user: req.session.user.id,
        status: "masuk",
      });

      await simpanLog(req.session.user.id, "Menambah transaksi parkir");

      res.redirect("/transaksi/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menambah transaksi");
    }
  },

  keluarTransaksi: async (req, res) => {
    try {
      const transaksi = await Transaksi.findById(req.params.id).populate(
        "id_tarif",
      );

      const waktu_keluar = new Date();
      const durasiMs = waktu_keluar - transaksi.waktu_masuk;
      const durasi_jam = Math.ceil(durasiMs / (1000 * 60 * 60));
      const biaya_total = durasi_jam * transaksi.id_tarif.tarif_per_jam;

      await Transaksi.findByIdAndUpdate(req.params.id, {
        waktu_keluar,
        durasi_jam,
        biaya_total,
        status: "keluar",
      });

      await simpanLog(req.session.user.id, "Transaksi parkir keluar");

      res.redirect("/transaksi/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal proses keluar");
    }
  },

  deleteTransaksi: async (req, res) => {
    try {
      await Transaksi.findByIdAndDelete(req.params.id);
      await simpanLog(req.session.user.id, "Menghapus transaksi");
      res.redirect("/transaksi/daftar");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal menghapus transaksi");
    }
  },

  getStrukParkir: async (req, res) => {
    try {
      const id = req.params.id;

      const transaksi = await Transaksi.findById(id)
        .populate("id_kendaraan")
        .populate("id_tarif")
        .populate("id_area")
        .populate("id_user");

      if (!transaksi) {
        return res.status(404).send("Transaksi tidak ditemukan");
      }

      res.render("strukParkir", { transaksi });
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan");
    }
  },

  cetakStrukParkir: async (req, res) => {
    try {
      const id = req.params.id;

      const transaksi = await Transaksi.findById(id)
        .populate("id_kendaraan")
        .populate("id_tarif")
        .populate("id_area")
        .populate("id_user");

      if (!transaksi) {
        return res.status(404).send("Data transaksi tidak ditemukan");
      }

      const html = fs.readFileSync(
        path.join(__dirname, "../template/templateStrukParkirPDF.html"),
        "utf8",
      );

      const document = {
        html,
        data: {
          transaksi: {
            plat: transaksi.id_kendaraan.plat_nomor,
            jenis: transaksi.id_kendaraan.jenis_kendaraan,
            area: transaksi.id_area.nama_area,
            masuk: transaksi.waktu_masuk.toLocaleString("id-ID"),
            keluar: transaksi.waktu_keluar.toLocaleString("id-ID"),
            durasi: transaksi.durasi_jam,
            tarif: transaksi.id_tarif.tarif_per_jam,
            total: transaksi.biaya_total,
            petugas: transaksi.id_user.nama_user,
            tanggal: transaksi.waktu_keluar.toLocaleDateString("id-ID"),
          },
        },
        path: "./output/struk_parkir.pdf",
      };

      await pdf.create(document, {});
      res.download("./output/struk_parkir.pdf");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal mencetak struk parkir");
    }
  },

  getRekap: async (req, res) => {
    try {
      const transaksi = await Transaksi.find({ status: "keluar" })
        .populate("id_kendaraan")
        .populate("id_area");

      const total = transaksi.reduce((sum, t) => sum + (t.biaya_total || 0), 0);

      res.render("rekapTransaksi", { transaksi, total });
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal mengambil data rekap");
    }
  },

  postRekap: async (req, res) => {
    try {
      const { tanggal_awal, tanggal_akhir } = req.body;

      let filter = { status: "keluar" };

      // Jika tanggal diisi, baru pakai filter tanggal
      if (tanggal_awal && tanggal_akhir) {
        const start = new Date(tanggal_awal);
        start.setHours(0, 0, 0, 0);

        const end = new Date(tanggal_akhir);
        end.setHours(23, 59, 59, 999);

        filter.waktu_keluar = {
          $gte: start,
          $lte: end,
        };
      }

      const transaksi = await Transaksi.find(filter)
        .populate("id_kendaraan")
        .populate("id_area");

      const total = transaksi.reduce((sum, t) => sum + (t.biaya_total || 0), 0);

      res.render("rekapTransaksi", { transaksi, total });
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal rekap transaksi");
    }
  },
};

module.exports = transaksiController;
