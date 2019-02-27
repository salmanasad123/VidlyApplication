
module.exports = function (req, res, next) {
    // this middleware function will be called after auth middleware which sets the req.user property so it will be available here (req.user)

    if (!req.user.isAdmin) {
        res.status(403).send("Access denied");
        return;
    }
    // pass the control to the next middleware function
    next();

}