import React, { useState, useEffect } from "react";
import axios from "axios";
import M from "materialize-css/dist/js/materialize.min.js";
import bg from "../images/dentist.png";

function Main() {
  const [fullname, setFullname] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tiemposDisponibles, setTiemposDisponibles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    M.AutoInit();
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/available-times", {
          params: {
            date: "2023-07-17"
          }
        });
        setTiemposDisponibles(response.data.times);
        setLoaded(true);
        console.log(response.data.times);
      } catch (error) {
        console.error("Error fetching available times:", error);
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case "fullname":
        setFullname(value);
        break;
      case "cellphone":
        setCellphone(value);
        break;
      case "date":
        setDate(value);
        break;
      case "time":
        setTime(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const makeAppointment = e => {
    e.preventDefault();
    const newAppointment = {
      fullname,
      cellphone,
      date,
      time,
      description
    };
    axios
      .post("/add-appointment", newAppointment)
      .then(result => {
        setSuccessMessage(result.data.msg);
        setFullname("");
        setCellphone("");
        setDate("");
        setTime("");
        setDescription("");
        M.toast({
          html: successMessage,
          classes: "green darken-1 rounded"
        });
      })
      .catch(error => {
        setErrorMessage(error.response.data.msg);
        M.toast({
          html: errorMessage,
          classes: "red darken-1 rounded"
        });
      });
  };

  const resetForm = () => {
    setFullname("");
    setCellphone("");
    setDate("");
    setTime("");
    setDescription("");
  };

  return (
    <div>
      <img src={bg} className="bg" alt="background" />
      <div className="container note">
        <div className="row">
          <div className="col s12 m6">
            <h2>Dont lose time</h2>
            <h2>Check your teeth now</h2>
            <h2>
              Book an appointment{" "}
              <i
                className="material-icons hide-on-small-only"
                style={{ fontSize: "38px" }}
              >
                arrow_forward
              </i>
              <i
                className="material-icons show-on-small hide-on-med-and-up"
                style={{ fontSize: "38px", textAlign: "center" }}
              >
                arrow_downward
              </i>
            </h2>
          </div>
          <div className="col s12 m6">
            <div className="card blue-grey darken-1 center-align">
              <div className="card-content white-text">
                <form>
                  <div className="input-field">
                    <i className="material-icons prefix">account_circle</i>
                    <input
                      id="full_name"
                      name="fullname"
                      type="text"
                      value={fullname}
                      className="validate"
                      onChange={handleChange}
                    />
                    <label htmlFor="full_name">Full Name</label>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">phone</i>
                    <input
                      id="cellphone"
                      name="cellphone"
                      type="number"
                      value={cellphone}
                      className="validate"
                      onChange={handleChange}
                    />
                    <label htmlFor="cellphone">Cellphone</label>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">event</i>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      className="validate"
                      value={date}
                      onChange={handleChange}
                    />
                    <label htmlFor="date">Date</label>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">access_time</i>
                    {/* <select
                      id="time"
                      name="time"
                      className="validate"
                      value={time}
                      onChange={handleChange}
                    >                      
                      <option value="" disabled>
                        Select Time
                      </option>   */}
                    {/* {loaded && console.log(tiemposDisponibles.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))) &&
                        tiemposDisponibles.map(time => (
                          <option  value={time}>
                            {time}
                          </option>
                        ))} */}
                    {/* {console.log(tiemposDisponibles.map(time => (
                          <option value={time} key={time}>
                            {time}
                          </option>
                        ))) && tiemposDisponibles.map(time => (
                          <option value={time} key={time}>
                            {time}
                          </option>
                        ))}
                    </select> */}
                    <select
                      id="time"
                      name="time"
                      className="validate"
                      value={time}
                      onChange={handleChange}
                    >
                   
                   {tiemposDisponibles.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                    </select>

                    <label htmlFor="time">Time</label>
                  </div>
                  <div className="input-field">
                    <i className="material-icons prefix">description</i>
                    <textarea
                      id="description"
                      name="description"
                      className="materialize-textarea"
                      style={{ height: "4rem" }}
                      value={description}
                      onChange={handleChange}
                    ></textarea>
                    <label htmlFor="description">How can we help you?</label>
                  </div>
                  <div className="card-action">
                    <button
                      className="waves-effect waves-light btn s12 m8"
                      style={{ margin: "5px" }}
                      onClick={makeAppointment}
                    >
                      <i className="material-icons right">send</i>Book
                      Appointment
                    </button>
                    <button
                      type="reset"
                      className="waves-effect red waves-light btn"
                      onClick={resetForm}
                    >
                      <i className="material-icons right">clear</i>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
