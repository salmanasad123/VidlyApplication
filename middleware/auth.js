const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // we get the token from request object in the headers
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401).send("Access denied.. No token provided");
        return;
    }
    // verify the token, and it will return decoded payload, if the token is not valid it will through exception so wrap it in try catch

    try {
        const decodedPayload = jwt.verify(token, "jwtPrivateKey");
        // we get our payload back which was initially decoded and we get user_id because that was set by us to decode
        req.user = decodedPayload;
        next();
    } catch (exception) {
        res.status(400).send("Invalid token");
    }

}


module.exports = auth;