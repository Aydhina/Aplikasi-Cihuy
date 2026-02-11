const express = require("express");
const router = express.Router();
const logController = require("../controllers/logAktivitasController");
const checkRole = require("../middleware/checkRole");

router.get("/daftar", checkRole("admin"), logController.getLog);

module.exports = router;