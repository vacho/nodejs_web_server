const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
corsOptions.manageCorsAccess(app);

// Middlewares.
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies.
app.use(express.json()); // Parse JSON bodies.

// Middleware for cookies.
app.use(cookieParser());

// Serving static files.
app.use('/', express.static(path.join(__dirname, 'public')));

// Custom Middleware for Logging.
app.use(logger);

// Server api.
app.use('/users', require('./routes/api/users'));
app.use('/employees', verifyJWT, require('./routes/api/employees'));
app.use('/', require('./routes/root'));

// Middleware to manage the errors logs.
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));