const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3500;

corsOptions.manageCorsAccess(app);

// Middlewares.
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies.
app.use(express.json()); // Parse JSON bodies.

// Serving static files.
app.use('/', express.static(path.join(__dirname, 'public')));

// Custom Middleware for Logging.
app.use(logger);

// Server api.
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
app.use('/', require('./routes/root'));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));