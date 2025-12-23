const cors = require('cors');

const manageCorsAccess = (app) => {
    // Cross-Origin Resource Sharing
    const whitelist = ['https://www.google.com', 'http://localhost:3500'];
    const corsOptions = {
        origin: (origin, callback) => {
            if (whitelist.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200
    }
    app.use(cors(corsOptions));
};

module.exports = {manageCorsAccess};