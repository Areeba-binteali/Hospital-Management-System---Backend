function allowedRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).send({
                success: false,
                message: "Access denied! You are not allowed to access this page"
            });
        }
        next();
    }
}

module.exports = allowedRoles;
