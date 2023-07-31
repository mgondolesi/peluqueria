const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



// Controlador para crear un nuevo usuario
const addUser = (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ msg: "Por favor ingrese usuario y contraseña." });
    }
  
    const lowercaseUsername = username.toLowerCase(); // Convertir a minúsculas
  
    User.findOne({ username: lowercaseUsername }).then((user) => {
      if (user) return res.status(400).json({ msg: "El nombre de usuario ya existe." });
  
      // Encriptar la contraseña utilizando bcrypt
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ msg: "Error occurred while hashing password." });
        }
  
        const newUser = new User({
          username: lowercaseUsername, // Almacena el username en minúsculas
          password: hash, // Almacena la contraseña encriptada
        });
  
        newUser.save().then((user) => {
          jwt.sign(
            { id: user._id },
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) return res.status(400).json({ msg: "Algo salió mal." });
              res.json({
                token,
                user: {
                  id: user._id,
                  username: user.username,
                },
              });
            }
          );
        });
      });
    });
  };
  
  

// Controlador para loguear un usuario
const loginUser = (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ msg: "Por favor ingrese usuario y contraseña." });
    }
  
    const lowercaseUsername = username.toLowerCase(); // Convertir a minúsculas
  
    User.findOne({ username: lowercaseUsername }).then((user) => {
      if (!user) return res.status(400).json({ msg: "El usuario no existe." });
  
      // Comparar la contraseña proporcionada con la contraseña encriptada almacenada en la base de datos
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ msg: "Error comparando la contraseña." });
        }
  
        if (!isMatch) {
          return res.status(400).json({ msg: "Credenciales inválidas" });
        }
  
        jwt.sign(
          { id: user._id },
          process.env.jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) return res.status(400).json({ msg: "Algo salió mal." });
            res.json({
              token,
              user: {
                id: user._id,
                username: user.username,
              },
            });
          }
        );
      });
    });
  };
  

// Exporta los controladores para usarlos en "routes.js"
module.exports = {
    addUser,
    loginUser,
};
