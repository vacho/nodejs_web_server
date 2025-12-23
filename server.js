const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// Middlewares.
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies.
app.use(express.json()); // Parse JSON bodies.
// Serving static files.
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));

// Custom Middleware for Logging.
app.use(logger);

// Server subdirectories.
app.use('/employees', require('./routes/api/employees'));
app.use('/subdir', require('./routes/subdir'));
app.use('/', require('./routes/root'));

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

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));