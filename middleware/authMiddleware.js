const jwt = require("jsonwebtoken")


function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    console.log(authorization);

    if (!authorization) {
        return res.status(400).send({
            message: "No token provided",
            success: false
        })
    }
    try {
        const token = authorization.replace("Bearer ", "");
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id
        req.userRole = decoded.role
        console.log(decoded);
    } catch (error) {
        res.status(401).send("Invalid Token")
    } 

    next();
}

module.exports = authMiddleware