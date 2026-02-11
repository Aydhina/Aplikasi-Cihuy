const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");
const checkSession = require("../middleware/checkSession");
const checkRole = require("../middleware/checkRole");

router.use(checkSession);

router.get("/daftar", checkRole("admin"), areaController.getDaftarArea);

router.get("/tambah", checkRole("admin"), areaController.getTambahArea);

router.post("/tambah", checkRole("admin"), areaController.tambahArea);

router.get("/edit/:id", checkRole("admin"), areaController.getEditArea);

router.post("/edit/:id", checkRole("admin"), areaController.editArea);

router.get("/delete/:id", checkRole("admin"), areaController.deleteArea);

module.exports = router;
