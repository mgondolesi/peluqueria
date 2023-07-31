import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, DatePicker, Spin } from 'antd';
import axios from "axios";
import M from "materialize-css/dist/js/materialize.min.js";
import bg from "../images/clinic-1.jpg";
import moment from 'moment';
import locale from '../../node_modules/antd/es/date-picker/locale/es_ES';

const { Option } = Select;

function Main() {
  const [fullname, setFullname] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [tiemposDisponibles, setTiemposDisponibles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [formattedToday, setFormattedToday] = useState(""); // Nueva variable de estado
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    M.AutoInit();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Obtener la fecha en formato "YYYY-MM-DD"
    setFormattedToday(formattedDate);
    fetchAvailableTimes(formattedDate); // Utilizar la fecha actual
  }, []);

  useEffect(() => {
    if (date || description) {
      fetchAvailableTimes(date?.format("YYYY-MM-DD"), description);
    }
  }, [date, description]);

  const fetchAvailableTimes = async (selectedDate, selectedService) => {
    try {
      const response = await axios.get("/available-times", {
        params: {
          date: selectedDate,
          description: selectedService
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
    setLoading(true);
    const newAppointment = {
      fullname,
      cellphone,
      date: date ? date.format("YYYY-MM-DD") : "",
      time,
      description,
      email
    };
    axios
      .post("/add-appointment", newAppointment)
      .then(result => {
        setFullname("");
        setCellphone("");
        setDate(null);
        setTime("");
        setDescription("");
        setEmail("");
        setLoading(false);
        message.success(result.data.msg, 2);
      })
      .catch(error => {
        setLoading(false);
        message.error(error.response.data.msg, 2);
      });
  };

  const resetForm = () => {
    setFullname("");
    setCellphone("");
    setDate(null);
    setTime("");
    setDescription("");
  };

  const disabledDate = (current) => {
    // Deshabilitar las fechas anteriores a hoy (incluyendo hoy)
    if (current && current < moment().startOf('day')) {
      return true;
    }

    // Deshabilitar los días lunes y domingos
    if (current && (current.day() === 0 || current.day() === 1)) {
      return true;
    }

    return false; // Permitir el resto de las fechas
  };

  return (
    <Spin spinning={loading}>
      <div>
        <img src={bg} className="bg" alt="background" />
        <div className="container note">
          <div className="row">
            <div className="col s12 m6">
              <h2>No pierdas tiempo</h2>

              <h2>
                Reserva tu turno{" "}
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
              <div className="card blue-grey lighten-1 center-align">
                <div className="card-content white-text">
                  <Form layout="vertical" onFinish={makeAppointment}>
                    <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Nombre</span>}>
                      {loaded && (
                        <Input
                          id="full_name"
                          name="fullname"
                          value={fullname}
                          onChange={e => setFullname(e.target.value)}
                          style={{ backgroundColor: 'white', borderRadius: "6px", height: "2.1rem" }}
                          required
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Celular</span>} style={{ width: '100%' }}>
                      {loaded && (
                        <Input
                          id="cellphone"
                          name="cellphone"
                          style={{ width: '100%', backgroundColor: 'white', borderRadius: "6px", height: "2.1rem" }}
                          value={cellphone}
                          onChange={e => setCellphone(e.target.value)}
                          required
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Correo Electrónico</span>}>
                      {loaded && (
                        <Input
                          id="email"
                          name="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          style={{ backgroundColor: 'white', borderRadius: "6px", height: "2.1rem" }}
                          type="email"
                          required // Hace que el campo sea obligatorio
                        />
                      )}
                    </Form.Item>
                    <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Fecha</span>} style={{ width: '100%' }}>
                      {loaded && (
                        <DatePicker
                          id="date"
                          name="date"
                          style={{ width: '100%' }}
                          value={date}
                          onChange={handleChangeDate}
                          placeholder={formattedToday}
                          disabledDate={disabledDate}
                          locale={locale}
                        />
                      )}
                    </Form.Item>
                    {date && (
                      <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Servicio</span>}>
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
                    )}

                    {date && description && (
                      <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Hora</span>}>
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
                    )}

                    <div className="card-action">
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ margin: "5px", backgroundColor: "#00796B", borderColor: "#00665A", color: "#ffffff" }}
                      >
                        <i className="material-icons right">send</i>Reservar
                      </Button>
                      <Button type="danger" htmlType="cancel" onClick={resetForm} style={{ backgroundColor: "#c63637", borderColor: "#BA3335", color: "#ffffff" }}>
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
    </Spin>
  );
}

export default Main;
