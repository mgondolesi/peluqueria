const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authController = require("../middleware/auth");
const mailController = require("../controllers/mailController");
const userController = require("../controllers/userController");

// Rutas para citas
router.get("/appointments", authController, appointmentController.getAppointments);
router.get("/available-times", appointmentController.getTurnosDisponibles);
router.post("/add-appointment", appointmentController.addAppointment);
router.put("/appointment/:id", authController, appointmentController.editAppointment);
router.delete("/appointment/:id", authController, appointmentController.deleteAppointment);

// Rutas para autenticación y usuarios
router.post("/register", userController.addUser);
router.post("/login", userController.loginUser);

// Rutas para enviar correos electrónicos
router.post("/send-email", mailController.sendMail);

// Exporta el enrutador para usarlo en "server.js"
module.exports = router;
