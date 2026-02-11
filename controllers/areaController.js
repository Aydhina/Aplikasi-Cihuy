const Area = require('../models/areaModel');
const { simpanLog } = require('./logAktivitasController');

const areaController = {
    getDaftarArea: async (req, res) => {
        try {
            const area = await Area.find();
            res.render('daftarArea', { area });
        } catch (error) {
            console.log(error);
            res.status(500).send("Terjadi kesalahan")
        }
    },

    getTambahArea: (req, res) => {
        res.render('tambahArea');
    },

    tambahArea: async(req, res) => {
        try {
            const { nama_area, kapasitas, terisi } = req.body;
            const area = new Area({ 
                nama_area,
                kapasitas: Number(kapasitas),
                terisi: Number(terisi) || 0
            }); 
            await area.save();

            await simpanLog(req.session.user.id, `Menambah area parkir: ${nama_area}`);

            res.redirect('/area/daftar')
        } catch (error) {
            console.log(error);
            res.status(500).send("Gagal menambah area parkir")
        }
    },

    getEditArea: async (req, res) => {
        try {
            const id = req.params.id;
            const area = await Area.findById(id);
            res.render('editArea', {area});
        } catch (error) {
            console.log(error);
            res.status(500).send("Terjadi kesalahan");
        }
    },

    editArea: async (req, res) => {
        try {
            const id = req.params.id;
            const { nama_area, kapasitas, terisi } = req.body;

            await Area.findByIdAndUpdate(id, {
                nama_area,
                kapasitas: Number(kapasitas),
                terisi: Number(terisi)
            });

            await simpanLog(req.session.user.id, `Mengedit area parkir: ${nama_area}`);
            
            res.redirect('/area/daftar')
        } catch (error) {
            console.log(error);
            res.status(500).send("Gagal mengedit area parkir");
        }
    },

    deleteArea: async (req, res) => {
        try {
            const id = req.params.id;
            const area = await Area.findById(id); 
            await Area.findByIdAndDelete(id);

            await simpanLog(req.session.user.id, `Menghapus area parkir: ${area ? area.nama_area : id}`);

            res.redirect('/area/daftar');
        } catch (error) {
            console.log(error);
            res.status(500).send("Gagal menghapus area parkir");
        }
    }
}

module.exports = areaController;