const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const apperror = require("../helpers/globalerrorehandler");

const register = async (req, res, next) => {
    try {
        const { username, password, email ,role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new apperror(400, "User already exists"));
        }
        if (role === "admin") {
            const adminExists = await User.findOne({ role: "admin" });
            if (adminExists) {
                
                return next(new apperror(400, "An admin already exists in the system"));
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            role
        });

        const token = jwt.sign({ id: newUser._id , role : newUser.role }, process.env.secret_key, { expiresIn: "1d" });
        res.status(201).json({ user: newUser, token });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new apperror(400, "User doesn't exist"));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new apperror(400, "Wrong email or password"));
        }

        const token = jwt.sign({ id: user._id , role : user.role }, process.env.secret_key, { expiresIn: "1d" });
        res.status(200).json({ user, token });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login };
