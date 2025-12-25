const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const data = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
};

const create = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    const duplicate = data.users.find(person => person.username === username);
    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }
    try {
        // Encrypt the password.
        const hashedPwd = await bcrypt.hash(password, 10);
        // Store the new user.
        const newUser = {
            'username': username,
            'password': hashedPwd
        };
        data.setUsers([...data.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(data.users)
        );
        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

const authenticate = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        res.status(400).json({'message': 'User and password are required'});
    }
    // Validate the user.
    const user = data.users.find(u => u.username === username);
    if (user) {
        // Validate the password.
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            // Authenthicate.
            // TODO: create a JWT (Jason Web Token)
            res.json({'success': `User ${username} logged in!`});
        } else {
            res.sendStatus(401); // unauthorized
        }
    } else {
        res.sendStatus(401); // unauthorized
    }
    console.log(user);
};

module.exports = { create, authenticate };
