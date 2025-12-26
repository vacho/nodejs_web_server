const jwt = require('jsonwebtoken');
require('dotenv').config();
const blacklist = require('../model/blacklist.json');

const verifyJWT = (req, res, next) => {
    // Get the header.
    const authHeader =  req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    // Extract the token.
    const token = authHeader.split(' ')[1];
    
    // Check if token is in blacklist
    if (blacklist.includes(token)) {
        return res.sendStatus(403); // Forbidden
    }

    // Verify if the token is valid.
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token
            req.user = decoded.username;
            next();
        }
    );
};

module.exports = verifyJWT;