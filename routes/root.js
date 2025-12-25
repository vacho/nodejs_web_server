const express = require('express');
const router = express.Router();
const path = require('path');

router.get(/^\/($|index(\.html)?)/, (req, res) => {
    //res.sendFile('./views/index.html', { root: __dirname });
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html')); 
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
router.get('/chain', [one, two, three]);

router.get(/(.*)/, (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

module.exports = router;