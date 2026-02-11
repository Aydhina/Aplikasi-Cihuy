const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const checkSession = require("../middleware/checkSession");
const checkRole = require("../middleware/checkRole");

router.use(checkSession);

router.get("/daftar", checkRole("admin", "petugas"), transaksiController.getDaftarTransaksi);

router.get("/tambah", checkRole("petugas"), transaksiController.getTambahTransaksi);

router.post("/tambah", checkRole("petugas"), transaksiController.tambahTransaksi);

router.get("/delete/:id", checkRole("petugas"), transaksiController.deleteTransaksi);

router.get("/keluar/:id", checkRole("petugas"), transaksiController.keluarTransaksi);

router.get("/struk/:id", checkRole("petugas"), transaksiController.getStrukParkir);

router.get("/cetak-struk/:id", checkRole("petugas"), transaksiController.cetakStrukParkir);

router.get("/rekap", checkRole("owner"), transaksiController.getRekap);

router.post("/rekap", checkRole("owner"), transaksiController.postRekap);

module.exports = router;
