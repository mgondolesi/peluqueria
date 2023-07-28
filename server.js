const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const jwt = require("jsonwebtoken");
const Appointment = require("./models/appointment");
const User = require("./models/user");
const auth = require("./middleware/auth");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");


const app = express();
app.use(cors());

app.use(express.json());
const PORT = process.env.PORT || 5000;

//Connect to MongoDB
const db = process.env.MONGO_URL;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(error => console.log(error));

//@route GET /appointments
//@desc  Get all appointments
//@access Private
app.get("/appointments", auth, (req, res) => {
  Appointment.find()
    .sort({ date: 1 })
    .then(appointments => res.json(appointments))
    .catch(err =>
      res
        .status(500)
        .json({ msg: "Could not get the appointments. Please try again." })
    );
});

//@route POST /
//@desc  Add new appointment
//@access Public
app.post("/add-appointment", (req, res) => {
  const { fullname, cellphone, date, time, description, email } = req.body;
  if (!fullname || !cellphone || !date || !time || !description || !email) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const validateDateTime = async (date, time) => {
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      res
        .status(400)
        .json({
          msg: "Please choose another date or time. This one is not available."
        });
    } else {
      saveAppointment();
    }
  };

  validateDateTime(date, time);
  const saveAppointment = () => {
    //Construct appointment
    const newAppointment = new Appointment({
      fullname,
      cellphone,
      date,
      time,
      description
    });
    // add to database
    newAppointment
      .save()
      .then(appointment => {
        // Aquí, después de guardar el nuevo turno, envía el correo electrónico
        const recipientEmail = email;
        const subject = "Nuevo turno reservado";
        const message = `Se ha reservado un nuevo turno para ${fullname} el día ${date} a las ${time}.`;
  
        // Realiza la solicitud HTTP a tu endpoint "/send-email" para enviar el correo
        axios.post('http://localhost:5000/send-email', {
          recipientEmail,
          subject,
          message
        })
        .then(response => {
          console.log("Correo electrónico enviado:", response.data.msg);
          res.json({ msg: "Turno reservado correctamente" });
        })
        .catch(error => {
          console.error("Error al enviar el correo:", error);
          res.status(500).json({ msg: "Error al enviar el correo. Intente nuevamente." });
        });
      })
      .catch(err => {
        console.error("Error al guardar el nuevo turno:", err);
        res.status(500).json({ msg: "Algo salio mal al guardar el turno. Intente nuevamente.", error: err });
      });
  };

});

//@route PUT /appointment/:id
//@desc  Edit an appointment
//@access Private
app.put("/appointment/:id", auth, (req, res) => {
  Appointment.findById(req.params.id)
    .then(appointment => {
      //New values
      const { date, time } = req.body;
      (appointment.date = date),
        (appointment.time = time),
        appointment
          .save()
          .then(appointment =>
            res.json({ msg: "Appointment edited succesfully" })
          )
          .catch(err =>
            res
              .status(500)
              .json({ msg: "Something went wrong. Please try again." })
          );
    })
    .catch(err => res.status(404).json({ msg: "Appointment not found" }));
});

//@route Delete /appointment/:id
//@desc  Delete an appointment
//@access Private
app.delete("/appointment/:id", auth, (req, res) => {
  Appointment.findById(req.params.id)
    .then(appointment =>
      appointment
        .remove()
        .then(() => res.json({ msg: "Appointment removed succesfully." }))
    )
    .catch(err => res.status(404).json({ msg: "Appointment not found" }));
});

//@route POST /login
//@desc  Admin login
//@access Public
app.post("/register", (req, res) => {
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
});

app.post("/login", (req, res) => {
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
        console.log(err);
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

  //Serve static assets if in production
  if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res)=>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  };

  app.post("/send-email", (req, res) => {
    const { recipientEmail, subject, message } = req.body;
  
    if (!recipientEmail || !subject || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }
  
    // Configura el transporte del correo electrónico (SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Cambiar a tu nombre de usuario de correo
        pass: process.env.GMAIL_PASSWORD // Cambiar a tu contraseña de correo
      }
    });
  
    // Define el contenido del correo electrónico en formato HTML con la imagen
    const imageSrc = "https://static.vecteezy.com/system/resources/previews/009/664/151/original/scissor-icon-transparent-free-png.png";
    const mailOptions = {
      from: 'mgondolesi@gmail.com', // Cambiar a tu dirección de correo
      to: recipientEmail,
      subject: subject,
      html: `<h1>${subject}</h1><p>${message}</p><img src="${imageSrc}" alt="Tijera" style="width: 100%; max-width: 600px;">`
    };
  
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ msg: 'Error al enviar el correo. Intente nuevamente.' });
      } else {
        console.log('Correo electrónico enviado:', info.response);
        res.json({ msg: 'Correo electrónico enviado exitosamente.' });
      }
    });
  });
  
  
  

//@route GET /available-times
//@desc  Get available times
//@access Public
app.get("/available-times", (req, res) => {
  
  const { date } = req.query;
  // Verificar si el parámetro 'date' está presente
  if (!date) {
    return res.status(400).json({ msg: "Date is required." });
  }
  // Obtener todos los horarios disponibles desde las 08:00 hasta las 20:00
  const allTimes = [];
  let time = new Date();
  time.setHours(8, 0, 0); // Establecer el horario inicial a las 08:00

  while (time.getHours() < 20) {
    allTimes.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    time.setMinutes(time.getMinutes() + 30); // Añadir 30 minutos
  }

  Appointment.find({date: req.query.date})
    .distinct("time") // Obtén los valores únicos de la propiedad "time"
    .then(occupiedTimes => {
      // Filtrar los tiempos ocupados de los horarios disponibles
      const availableTimes = allTimes.filter(time => !occupiedTimes.includes(time));
      res.json({ times: availableTimes });
    })
    .catch(err =>
      res
        .status(500)
        .json({ msg: "Could not get the available times. Please try again." })
    );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
