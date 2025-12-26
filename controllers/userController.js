const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const data = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
};

const blacklist = {
    tokens: require('../model/blacklist.json'),
    setTokens: function(data) { this.tokens = data }
};

const list = (req, res) => {
    const users = data.users.map(user => {
        return {...user, password: '...'};
    });
    res.json(users);
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
            'roles': { 'User': 2001 },
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
        return res.status(400).json({'message': 'User and password are required'});
    }
    // Validate the user.
    const user = data.users.find(u => u.username === username);
    if (user) {
        // Validate the password.
        let match = await bcrypt.compare(password, user.password);
        if (match) {
            // Authenthicate.
            const roles = Object.values(user.roles);

            // Create a JWT (Jason Web Token)
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": user.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s' }
            );
            const refreshToken = jwt.sign(
                { "username": user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user and into a cookie.
            const otherUsers = data.users.filter(u => u.username !== user.username);
            const currentUser = { ...user, refreshToken};
            data.setUsers([...otherUsers, currentUser]);
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'),
                JSON.stringify(data.users)    
            );
            // TODO: set secure as true to https(prod env).
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24*60*60*1000 });
            // Return to the enduser the accessToken.
            res.json({accessToken});
        } else {
            res.sendStatus(401); // unauthorized
        }
    } else {
        res.sendStatus(401); // unauthorized
    }
};

const refreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //unauthorize
    const refreshToken = cookies.jwt;
    // Validate the user.
    const user = data.users.find(u => u.refreshToken === refreshToken);
    if (user) {
        // evaluate jwt.
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error || user.username !== decoded.username) {
                    return res.sendStatus(403); // invalida token
                }
                const roles = Object.values(user.roles);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": user.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "60s"}
                );
                res.json({ accessToken });
            }    
        );
    } else {
        res.sendStatus(403); // forbidden
    }
}

const logout = async (req, res) => {
    const cookies = req.cookies;
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!cookies?.jwt) return res.sendStatus(204); //nocontent
    const refreshToken = cookies.jwt;
    
    const user = data.users.find(u => u.refreshToken === refreshToken);
    if (user) {
        // REFRESH TOKEN
        // Delete from DB.
        const otherUsers = data.users.filter(u => u.refreshToken !== refreshToken);
        const currentUser = {...user, refreshToken: ''};
        data.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(data.users)
        );
        // Delete from cookies.
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
        // Invalidate the current isn't needed because needs the 'jwt'.

        // ACCESS TOKEN
        // invalidate the current.
        if (accessToken) {
            blacklist.setTokens([...blacklist.tokens, accessToken]);
            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'blacklist.json'),
                JSON.stringify(blacklist.tokens)
            );
        }

        res.sendStatus(204); //no-content
    } else {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false  });
        res.sendStatus(204); //no-content 
    }
}

module.exports = { create, authenticate, list, refreshToken, logout };
