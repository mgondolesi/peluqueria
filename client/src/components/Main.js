import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, DatePicker, InputNumber } from 'antd';
import axios from "axios";
import M from "materialize-css/dist/js/materialize.min.js";
import bg from "../images/clinic-1.jpg";

const { Option } = Select;

function Main() {
  const [fullname, setFullname] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tiemposDisponibles, setTiemposDisponibles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    M.AutoInit();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Obtener la fecha en formato "YYYY-MM-DD"
    fetchAvailableTimes(formattedDate); // Utilizar la fecha actual
  }, []);

  useEffect(() => {
    if (date) {
      fetchAvailableTimes(date.format("YYYY-MM-DD"));
    }
  }, [date]);

  const fetchAvailableTimes = async (selectedDate) => {
    try {
      const response = await axios.get("http://localhost:5000/available-times", {
        params: {
          date: selectedDate
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

  const handleChangeTime = (value) => {
    console.log(value);
    setTime(value);
  };

  const handleChangeDesc = (value) => {
    console.log(value);
    setDescription(value);
  };

  const handleChangeDate = (date) => {
    console.log(date);
    setDate(date);
  };

  const makeAppointment = (e) => {
    //e.preventDefault();
    const newAppointment = {
      fullname,
      cellphone,
      date: date ? date.format("YYYY-MM-DD") : "",
      time,
      description
    };
    axios
      .post("/add-appointment", newAppointment)
      .then(result => {
        setSuccessMessage(result.data.msg);
        setFullname("");
        setCellphone("");
        setDate(null);
        setTime("");
        setDescription("");
        message.success(successMessage, 2);
      })
      .catch(error => {
        setErrorMessage(error.response.data.msg);
        message.error(errorMessage, 2);
      });
  };

  const resetForm = () => {
    setFullname("");
    setCellphone("");
    setDate(null);
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
                <Form layout="vertical" onFinish={makeAppointment}>
                  <Form.Item label="Nombre">
                    {loaded && (
                      <Input
                        id="full_name"
                        name="fullname"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Teléfono" style={{ width: '100%' }}>
                    {loaded && (
                      <Input
                        id="cellphone"
                        name="cellphone"
                        style={{ width: '100%' }}
                        value={cellphone}
                        onChange={e => setCellphone(e.target.value)}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Fecha" style={{ width: '100%' }}>
                    {loaded && (
                      <DatePicker
                        id="date"
                        name="date"
                        style={{ width: '100%' }}
                        value={date}
                        onChange={handleChangeDate}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Hora">
                    {loaded && (
                      <Select
                        id="time"
                        name="time"
                        value={time}
                        onChange={handleChangeTime}
                      >
                        {tiemposDisponibles.map(time => (
                          <Option key={time} value={time}>
                            {time}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="Descripción">
                    {loaded && (
                      <Select
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChangeDesc}
                      >
                        <Option key='Corte Hombre' value='Corte Hombre'>
                          Corte Hombre
                        </Option>
                        <Option key="Corte Mujer" value="Corte Mujer">
                          Corte Mujer
                        </Option>
                        <Option key="Color" value="Color">
                          Color
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                  <div className="card-action">
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ margin: "5px" }}
                    >
                      <i className="material-icons right">send</i>Reservar
                    </Button>
                    <Button type="danger" htmlType="cancel" onClick={resetForm} className="red darken-1">
                      <i className="material-icons right">clear</i>Limpiar
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
