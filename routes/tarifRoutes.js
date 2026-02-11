const express = require("express");
const router = express.Router();
const tarifController = require("../controllers/tarifController");
const checkSession = require("../middleware/checkSession");
const checkRole = require("../middleware/checkRole");

router.use(checkSession);

router.get("/daftar",checkRole("admin"), tarifController.getDaftarTarif);

router.get("/tambah",checkRole("admin"), tarifController.getTambahTarif);

router.post("/tambah",checkRole("admin"), tarifController.tambahTarif);

router.get("/edit/:id",checkRole("admin"), tarifController.getEditTarif);

router.post("/edit/:id",checkRole("admin"), tarifController.editTarif);

router.get("/delete/:id",checkRole("admin"), tarifController.deleteTarif);

module.exports = router;
