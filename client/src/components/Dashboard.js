import React, { Component } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Modal,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
// import Spinner from "../images/loading.gif";
import ReactPaginate from "react-paginate";
import "../dashboard.css";
import dayjs from "dayjs";


// Importa los componentes del DatePicker de antd
import { DatePicker, Input, Form, Select } from "antd";
//import "antd/dist/antd.css";
const { Option } = Select;

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#c9c9c9", // Fondo blanco
  border: "0px solid #000",
  boxShadow: 24,
  padding: "16px",
  outline: "none", // Elimina el borde alrededor del modal
  minWidth: "300px",
  maxWidth: "600px",
  width: "80%", // Ajusta el ancho del modal
  borderRadius: "20px",
};

const inputStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "6px",
  height: "2.5rem",
  width: "12.15rem",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
  boxSizing: "border-box",
  padding: "4px 11px 4px",
  fontSize: "14px",
  border: "1px solid #d9d9d9",
};

const styles = (theme) => ({
  dashboard: {
    marginTop: theme.spacing(4),
  },
  searchInputs: {
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    marginBottom: theme.spacing(2),
  },
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  modalButtons: {
    marginRight: theme.spacing(2),
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(2),
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      filterName: "",
      filterDate: dayjs(), // Cambiar el valor inicial a null
      appointment: {},
      loading: false,
      isAuthenticated: false,
      deleteModalOpen: false,
      editModalOpen: false,
      registerModalOpen: false,
      currentPage: 0,
      appointmentsPerPage: 10, // Número de citas por página
      username: "",
      password: "",
      tiemposDisponibles: [],
      loaded: false,
      selectedTime: "",
    };
    this.dateInput = React.createRef();
    this.timeInput = React.createRef();
  }

  componentDidMount() {
    M.AutoInit();
    this.getAppointments();
  }

  getAppointments = () => {
    const token = localStorage.getItem("lcl-stg-tkn");
    if (token) {
      this.setState({
        loading: true,
        isAuthenticated: true,
      });

      axios
        .get(process.env.REACT_APP_API_URL + "/appointments", {
          headers: {
            "Content-type": "application/json",
            "x-auth-token": token,
          },
        })
        .then((res) =>
          this.setState({
            appointments: res.data,
            loading: false,
          })
        )
        .catch((err) => console.log(err));
    } else {
      this.props.history.push("/login");
    }
  };

  deleteAppointment = (id) => {
    axios
      .delete(process.env.REACT_APP_API_URL + `/appointment/${id}`, {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": localStorage.getItem("lcl-stg-tkn"),
        },
      })
      .then((res) => {
        const objToDeleteIndex = this.state.appointments.findIndex(
          (obj) => obj._id === id
        );
        const newItems = [...this.state.appointments];
        newItems.splice(objToDeleteIndex, 1);
        this.setState({ appointments: newItems });
        M.toast({
          html: res.data.msg,
          classes: "green darken-1 rounded",
        });
      })
      .catch((err) => console.log(err));
  };

  editAppointment = () => {
    const { _id } = this.state.appointment;
    const updatedValues = {
      date: this.dateInput.current.value,
      time: this.state.selectedTime
    };

    axios
      .put(process.env.REACT_APP_API_URL + `/appointment/${_id}`, updatedValues, {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": localStorage.getItem("lcl-stg-tkn"),
        },
      })
      .then((res) => {
        const objToEditIndex = this.state.appointments.findIndex(
          (obj) => obj._id === _id
        );
        const newItems = [...this.state.appointments];
        newItems[objToEditIndex].date = updatedValues.date;
        newItems[objToEditIndex].time = updatedValues.time;
        this.setState({ appointments: newItems });

        M.toast({
          html: res.data.msg,
          classes: "green darken-1 rounded",
        });
        this.setState({
          selectedTime: "",
          loaded: false,          
        })
      })
      .catch((err) => console.log(err));
  };

  registerUser = () => {
    const { username, password } = this.state;
    const newUser = { username, password };

    axios
      .post(process.env.REACT_APP_API_URL + "/register", newUser)
      .then(res => {
        M.toast({
          html: "Usuario: " + res.data.user.username + " creado exitosamente.",
          classes: "green darken-1 rounded"
        })
      })
      .catch(err =>
        M.toast({
          html: err.response.data.msg,
          classes: "red darken-1 rounded"
        })
      );
  };

  fetchAvailableTimes = async (selectedDate, selectedService) => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + "/available-times", {
        params: {
          date: selectedDate,
          description: selectedService
        }
      });
      this.setState({
        tiemposDisponibles: response.data.times,
        loaded: true,
      });
      console.log(this.tiemposDisponibles);
      console.log(this.loaded);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  handleDeleteModalOpen = () => {
    this.setState({ deleteModalOpen: true });
  };

  handleEditModalOpen = () => {
    this.setState({ editModalOpen: true });
  };

  handleRegisterModalOpen = () => {
    this.setState({ registerModalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ deleteModalOpen: false, editModalOpen: false, registerModalOpen: false });
  };

  handlePageChange = (selectedPage) => {
    this.setState({ currentPage: selectedPage.selected });
  };

  render() {
    const { classes } = this.props;
    let nr = 1;
    const {
      filterName,
      filterDate,
      loading,
      appointment,
      currentPage,
      appointmentsPerPage,
      username,
      password,
      tiemposDisponibles,
      loaded
    } = this.state;
    const { fullname, date, time, description } = appointment;

    // Filtrar por fecha antes de aplicar la paginación
    const filteredAppointments = this.state.appointments
      .filter((key) =>
        filterDate
          ? key.date.includes(filterDate.format("YYYY-MM-DD"))
          : true
      )
      .filter((key) =>
        key.fullname.toLowerCase().includes(filterName.toLowerCase())
      );

    // Ordenar por hora antes de mostrar los appointments
    const sortedAppointments = filteredAppointments.sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    const indexOfLastAppointment = (currentPage + 1) * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = sortedAppointments.slice(
      indexOfFirstAppointment,
      indexOfLastAppointment
    );

    return (
      <Container className={classes.dashboard}>
        <Box>
          <Typography variant="h4" style={{ color: "#c9c9c9" }} gutterBottom>
            Administrar Turnos
          </Typography>
          <Typography
            variant="h6"
            style={{ color: "#c9c9c9" }}
            gutterBottom
          >
            Turnos Totales: {filteredAppointments.length}
          </Typography>
        </Box>
        <Box className={classes.searchInputs}>
          {/* <TextField
            id="fullname"
            label="Buscar por nombre"
            variant="outlined"
            value={filterName}
            onChange={(e) => this.setState({ filterName: e.target.value })}
            InputProps={{
              style: { backgroundColor: "#c9c9c9", height:"2.3rem" },
            }}
            InputLabelProps={{
              style: { backgroundColor: "#c9c9c9", height:"2.3rem" },
            }}
          /> */}
          <Input
            id="fullname"
            label="Buscar por nombre"
            placeholder="Buscar por nombre"
            className="input-antd"
            style={inputStyle}
            value={filterName}
            onChange={(e) => this.setState({ filterName: e.target.value })}
          />
          <br></br>

          <div style={{ display: "flex", alignItems: "center" }}>
            <DatePicker
              id="date"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "6px",
                height: "2.5rem",
                width: "12.15rem",
              }}
              value={filterDate}
              onChange={(value) => this.setState({ filterDate: value })}
            />

          </div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              this.handleRegisterModalOpen();
            }}
            style={{ marginTop: "1%" }}
          >
            Crear Administrador
          </Button>
        </Box>

        {loading ? (
          <div className={classes.spinnerContainer}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer className={classes.tableContainer} style={{ borderRadius: `20px` }}>
            <Table>
              <TableHead style={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }} >No.</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Hora</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Telefono</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Descripcion</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#c9c9c9" }}>
                {currentAppointments.map((appointment) => (
                  <TableRow key={appointment._id} style={{ backgroundColor: "#c9c9c9" }}>
                    <TableCell>{nr++}</TableCell>
                    <TableCell>{dayjs(appointment.date).format("DD/MM/YYYY")}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.fullname}</TableCell>
                    <TableCell>{appointment.cellphone}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          this.setState({ appointment });
                          this.handleDeleteModalOpen();
                        }}
                      >
                        Cancelar
                      </Button>{" "}
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          this.setState({ appointment });
                          this.handleEditModalOpen();
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box className={classes.paginationContainer}>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(filteredAppointments.length / appointmentsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageChange}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            previousClassName={"paginateArrow"}
            nextClassName={"paginateArrow"}
          />
        </Box>

        <Modal
          open={this.state.deleteModalOpen}
          onClose={this.handleModalClose}
        >
          <div style={modalStyles}>
            <Typography style={{ textAlign: "center" }} variant="h6">
              Estas seguro que deseas cancelar el turno de:
            </Typography>
            <Typography style={{ textAlign: "center" }} variant="h5">{fullname}</Typography>
            <Box mt={2} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.handleModalClose();
                  this.deleteAppointment(appointment._id);
                }}
                className={classes.modalButtons}
              >
                Si
              </Button>
              <Button
                variant="contained"
                onClick={this.handleModalClose}
                className={classes.modalButtons}
              >
                No
              </Button>
            </Box>
          </div>
        </Modal>
        <Modal open={this.state.editModalOpen} onClose={this.handleModalClose}>
          <div style={modalStyles}>
            <Typography style={{ textAlign: "center" }} variant="h6">
              Estás modificando el turno de:
            </Typography>
            <Typography style={{ fontWeight:"bold", textAlign: "center" }} variant="h5">
              {fullname}
            </Typography>
            <Typography style={{ textAlign: "center" }} variant="h6">
              Servicio: <Box component="span" fontWeight="bold">{description}</Box>
            </Typography>
            <form>
              <Box mt={2} style={{ textAlign: "center" }}>
                <TextField
                  id="editDate"
                  name="editDate"
                  type="date"
                  variant="outlined"
                  defaultValue={date}
                  inputRef={this.dateInput}
                  onChange={(event) => this.fetchAvailableTimes(event.target.value, description)}
                  onBlur= {() => this.setState({selectedTime: time})}
                />
              </Box>
              <Box mt={2} style={{ textAlign: "center" }}>
                {loaded && (<Select
                  id="editTime"
                  name="editTime"
                  defaultValue={time}
                  dropdownStyle={{ zIndex: 9999, position: 'relative' }}
                  onChange={(value) => this.setState({ selectedTime: value})}
                  inputRef={this.timeInput}
                  >
                  {tiemposDisponibles.map(time => (
                    <Option key={time} value={time}>
                      {time}
                    </Option>
                  ))}
                </Select>)}
                
              </Box>
              <Box mt={2} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.handleModalClose();
                    this.editAppointment();
                  }}
                  className={classes.modalButtons}
                >
                  Modificar
                </Button>
                <Button
                  variant="contained"
                  onClick={this.handleModalClose}
                  className={classes.modalButtons}
                >
                  Atrás
                </Button>
              </Box>
            </form>
          </div>
        </Modal>

        <Modal open={this.state.registerModalOpen} onClose={this.handleModalClose}>
          <div style={modalStyles}>
            <Typography style={{ textAlign: "center" }} variant="h6">
              Agregar un nuevo usuario administrador a la plataforma
            </Typography>
            <form>
              <Box mt={2} style={{ textAlign: "center" }}>
                <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Nombre de Usuario</span>}>
                  <Input
                    id="username"
                    type="text"
                    className="validate"
                    value={username}
                    onChange={e =>
                      this.setState({ username: e.target.value })
                    }
                  />
                </Form.Item>

              </Box>
              <Box mt={2} style={{ textAlign: "center" }}>

                <Form.Item label={<span style={{ color: '#454545', fontWeight: 'bold' }}>Contraseña</span>}>
                  <Input
                    id="password"
                    type="password"
                    className="validate"
                    value={password}
                    onChange={e =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </Form.Item>
              </Box>

              <Box mt={2} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.handleModalClose();
                    this.registerUser();
                  }}
                  className={classes.modalButtons}
                >
                  Crear Administrador
                </Button>
                <Button
                  variant="contained"
                  onClick={this.handleModalClose}
                  className={classes.modalButtons}
                >
                  Atrás
                </Button>
              </Box>
            </form>
          </div>
        </Modal>

      </Container>
    );
  }
}

export default withStyles(styles)(Dashboard);
