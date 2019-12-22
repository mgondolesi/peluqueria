const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const jwt = require("jsonwebtoken");
const Appointment = require("./models/appointment");
const User = require("./models/user");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5000;

//Connect to MongoDB
const db = process.env.MONGO_URI;

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
  const { fullname, cellphone, date, time, description } = req.body;
  if (!fullname || !cellphone || !date || !time || !description) {
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
      .then(appointment => res.json({ msg: "Appointment added succesfully" }))
      .catch(err =>
        res.status(500).json({ msg: "Something went wrong. Please try again." })
      );
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
