const User = require("../models/user");
const jwt = require("jsonwebtoken");


// Controlador para crear un nuevo usuario
const addUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Please enter all fields." });
    }

    User.findOne({ username }).then(user => {
        if (user) return res.status(400).json({ msg: "Username already exists." });

        const newUser = new User({
            username,
            password
        });

        newUser.save().then(user => {
            jwt.sign(
                { id: user._id },
                process.env.jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) return res.status(400).json({ msg: "Something went wrong" });
                    res.json({
                        token,
                        user: {
                            id: user._id,
                            username: user.username
                        }
                    });
                }
            );
        });
    });
};

// Controlador para loguear un usuario
const loginUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Please enter all fields." });
    }

    User.findOne({ username }).then(user => {
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        if (user.password !== password)
            return res.status(400).json({ msg: "Invalid credentials" });

        jwt.sign(
            { id: user._id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) return res.status(400).json({ msg: "Something went wrong" });
                res.json({
                    token,
                    user: {
                        id: user._id,
                        username: user.username
                    }
                });
            }
        );
    });
};

// Exporta los controladores para usarlos en "routes.js"
module.exports = {
    addUser,
    loginUser,
};
