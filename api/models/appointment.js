const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const AppointmentSchema = new Schema({
    fullname:{
        type: String,
        required: true
    },
    cellphone:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true,
    }, 
    time:{
        type: String,
        required: true
    }, 
    description:{
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    }
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema)