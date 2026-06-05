const userService = require('../services/userService');

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).send("username and password are required");

    try {
        const result = await userService.authenticate(username, password);

        if (result.error === "USER_NOT_FOUND") return res.status(401).send("The username does not exist");
        if (result.error === "INVALID_PASSWORD") return res.status(401).send("The password is incorrect");

        res.json({ token: result.token });
    } catch (error) {
        res.status(500).send("Login error");
    }
};

const register = async (req, res) => {
    const { username, password, phone } = req.body;
    if (!username || !password)
        return res.status(400).send("username and password are required");

    try {
        const result = await userService.createUser(username, password, phone);

        if (result.error === "USER_EXISTS") return res.status(409).send("the username exists");
        if (result.error === "CREATION_FAILED") return res.status(400).send("error");

        res.json(result);
    } catch (error) {
        res.status(500).send("Registration error");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users");
    }
};

module.exports = { login, register, getAllUsers };