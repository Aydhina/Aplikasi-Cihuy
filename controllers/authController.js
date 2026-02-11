const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const { simpanLog } = require("./logAktivitasController");

const authController = {
  getRegister: (req, res) => {
    res.render("register");
  },

  getLogin: (req, res) => {
    res.render("login");
  },

  register: async (req, res) => {
    try {
      const { nama_lengkap, username, password, role } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userBaru = new User({
        nama_lengkap,
        username,
        password: hashedPassword,
        role: "admin",
        status_aktif: true,
      });

      const savedUser = await userBaru.save();

      await simpanLog(savedUser._id, "Registrasi akun baru");

      res.redirect("/auth/login");
    } catch (error) {
      console.log(error);
      res.status(500).send("Gagal registrasi");
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).send("Username tidak ditemukan");
      }

      if (!user.status_aktif) {
        return res.status(403).send("Akun Anda tidak aktif");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).send("Password salah");
      }

      req.session.user = {
        id: user._id,
        username: user.username,
        nama: user.nama_lengkap,
        role: user.role,
      };

      await simpanLog(user._id, "Login ke sistem");

      // 🔑 REDIRECT BERDASARKAN ROLE
      if (user.role === "admin") {
        return res.redirect("/tarif/daftar");
      }

      if (user.role === "petugas") {
        return res.redirect("/transaksi/daftar");
      }

      if (user.role === "owner") {
        return res.redirect("/transaksi/rekap");
      }

      // fallback
      res.redirect("/auth/login");
    } catch (error) {
      console.log(error);
      res.status(500).send("Terjadi kesalahan login");
    }
  },

  logout: async (req, res) => {
    if (req.session.user) {
      await simpanLog(req.session.user.id, "Logout dari sistem");
    }
    req.session.destroy();
    res.redirect("/auth/login");
  },
};

module.exports = authController;
