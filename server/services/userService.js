const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticate = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) return { error: "USER_NOT_FOUND" };
    const match = await bcrypt.compare(password, user.password);
    if (!match) return { error: "INVALID_PASSWORD" };
    const userInfo = {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        isAdmin: user.isAdmin,
    };
    const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
    return { token };
};

const createUser = async (username, password, phone) => {
    const exist = await User.findOne({ username }).lean();
    if (exist) return { error: "USER_EXISTS" };
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashPassword, phone });
    if (!user) return { error: "CREATION_FAILED" };
    const userInfo = {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        isAdmin: user.isAdmin,
    };
    const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
    return { user, token };
};

const getAll = async () => {
    return await User.find();
};

module.exports = {
    authenticate,
    createUser,
    getAll
};