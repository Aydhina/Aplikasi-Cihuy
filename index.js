const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/connectDb")
const path = require("path");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const tarifRoutes = require("./routes/tarifRoutes");
const kendaraanRoutes = require("./routes/kendaraanRoutes");
const areaRoutes = require("./routes/areaRoutes");
const logAktivitasRoutes = require("./routes/logAktivitasRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");

const port = process.env.PORT; 

connectDB(); 

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "ejs"); 

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(session({ 
    secret: 'rahasia-parkir', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use((req,res, next) => { 
    res.locals.user = req.session.user || null;
    next();
})

app.use("/auth", authRoutes);
app.use("/tarif", tarifRoutes);
app.use("/kendaraan", kendaraanRoutes);
app.use("/area", areaRoutes);
app.use("/logAktivitas", logAktivitasRoutes);
app.use("/transaksi", transaksiRoutes);

app.listen(port, () => {
    console.log(`example app listening at http://localhost:${port}`);
})