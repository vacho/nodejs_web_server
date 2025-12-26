const cors = require('cors');
const allowedOrigins = require('./allowedOrigins');

const manageCorsAccess = (app) => {
    // Cross-Origin Resource Sharing
    const corsOptions = {
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
};

module.exports = {manageCorsAccess};