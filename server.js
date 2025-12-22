const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// Middlewares
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies.
app.use(express.json()); // Parse JSON bodies.
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory.

// Custom Middleware for Logging
app.use(logger);

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

app.get(/^\/($|index(\.html)?)/, (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});
app.get(/new-page(\.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html')); 
});
app.get(/old-page(\.html)?/, (req, res) => {
    res.redirect(301, '/new-page.html'); // 302 by default.
});
app.get(/hello(\.html)?/, (req, res, next) => {
    console.log('Attepted to load hello.html')
    next();
}, (req, res) => {
    res.send('Hello World!');
});

// Chaining route handlers.
const one = (req, res, next) => {
    console.log('One');
    next();
};
const two = (req, res, next) => {
    console.log('Two');
    next();
};
const three = (req, res) => {
    console.log('Three');
    res.send('Finished!');
};
app.get('/chain', [one, two, three]);

app.get(/(.*)/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));