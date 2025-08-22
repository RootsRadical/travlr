const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// Login function
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Passport authentication error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
            return res.status(401).json(info); // e.g. "Invalid credentials"
        }

        const token = user.generateJWT();
        res.status(200).json({ token });
    })(req, res, next);
};

// Register function
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const user = new User({
            name,
            email,
        });

        user.setPassword(password);

        await user.save();

        const token = user.generateJWT();
        res.status(201).json({ token });

    } catch (err) {
        console.error('User registration error:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = {
    register,
    login,
};
