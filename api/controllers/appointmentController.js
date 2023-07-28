const Appointment = require("../models/appointment");
const axios = require("axios");

// Controlador para obtener todas las citas
const getAppointments = (req, res) => {
    Appointment.find()
        .sort({ date: 1 })
        .then(appointments => res.json(appointments))
        .catch(err =>
            res
                .status(500)
                .json({ msg: "Could not get the appointments. Please try again." })
        );
}

// Controlador para agregar una nueva cita
const addAppointment = (req, res) => {
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
                const message = `Se ha reservado un nuevo turno para <strong>${fullname}</strong> el día <strong>${date}</strong> a las <strong>${time}</strong>.`;

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

};

// Controlador para editar una cita
const editAppointment = (req, res) => {
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
};

// Controlador para eliminar una cita
const deleteAppointment = (req, res) => {
    Appointment.findById(req.params.id)
        .then(appointment =>
            appointment
                .remove()
                .then(() => res.json({ msg: "Appointment removed succesfully." }))
        )
        .catch(err => res.status(404).json({ msg: "Appointment not found" }));
};

const getTurnosDisponibles = (req, res) => {
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
      };

// Exporta los controladores para usarlos en "routes.js"
module.exports = {
    getAppointments,
    addAppointment,
    editAppointment,
    deleteAppointment,
    getTurnosDisponibles,
};
