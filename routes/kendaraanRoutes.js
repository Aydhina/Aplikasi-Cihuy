const express = require("express");
const router = express.Router();
const kendaraanController = require("../controllers/kendaraanController");
const checkSession = require("../middleware/checkSession");
const checkRole = require("../middleware/checkRole");

router.use(checkSession);

router.get("/daftar",checkRole("admin"), kendaraanController.getDaftarKendaraan);

router.get("/tambah",checkRole("admin"), kendaraanController.getTambahKendaraan);

router.post("/tambah",checkRole("admin"), kendaraanController.tambahKendaraan);

router.get("/edit/:id",checkRole("admin"), kendaraanController.getEditKendaraan);

router.post("/edit/:id",checkRole("admin"), kendaraanController.editKendaraan);

router.get("/delete/:id",checkRole("admin"), kendaraanController.deleteKendaraan);

module.exports = router;
