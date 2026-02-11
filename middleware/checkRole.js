const checkRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.session.user?.role;
        if (userRole && roles.includes(userRole)) {
            next();
        } else {
            console.log("Role saat ini:", req.session.user?.role);

            res.status(403).send("Akses ditolak");
        }
    };
};

module.exports = checkRole;