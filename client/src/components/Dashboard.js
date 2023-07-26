import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  Paper,
  TextField,
  CircularProgress,
  Modal,
  Typography,
  Box,
  Container,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Spinner from "../images/loading.gif";
import ReactPaginate from "react-paginate";

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
      filterDate: "",
      appointment: {},
      loading: false,
      isAuthenticated: false,
      deleteModalOpen: false,
      editModalOpen: false,
      currentPage: 0,
      appointmentsPerPage: 10, // Número de citas por página
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
        .get("/appointments", {
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
      .delete(`/appointment/${id}`, {
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
      time: this.timeInput.current.value,
    };

    axios
      .put(`/appointment/${_id}`, updatedValues, {
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
      })
      .catch((err) => console.log(err));
  };

  handleDeleteModalOpen = () => {
    this.setState({ deleteModalOpen: true });
  };

  handleEditModalOpen = () => {
    this.setState({ editModalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ deleteModalOpen: false, editModalOpen: false });
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
      appointments,
      currentPage,
      appointmentsPerPage,
    } = this.state;
    const { fullname, date, time } = appointment;

    const indexOfLastAppointment = (currentPage + 1) * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointments.slice(
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
            Turnos Totales: {appointments.length}
          </Typography>
        </Box>
        <Box className={classes.searchInputs}>
          <TextField
            id="fullname"
            label="Buscar por nombre"
            variant="outlined"
            value={filterName}
            onChange={(e) => this.setState({ filterName: e.target.value })}
            InputProps={{
              style: { backgroundColor: "#c9c9c9" },
            }}
            InputLabelProps={{
              style: { backgroundColor: "#c9c9c9" },
            }}
          />
          <TextField
            id="date"
            label="Buscar por fecha"
            variant="outlined"
            value={filterDate}
            onChange={(e) => this.setState({ filterDate: e.target.value })}
            InputProps={{
              style: { backgroundColor: "#c9c9c9" },
            }}
            InputLabelProps={{
              style: { backgroundColor: "#c9c9c9" },
            }}
          />
        </Box>
        {loading ? (
          <div className={classes.spinnerContainer}>
            <CircularProgress />
          </div>
        ) : (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead style={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Telefono</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell style={{ width: "300px" }}>Descripcion</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: "#c9c9c9" }}>
                {currentAppointments
                  .filter((key) =>
                    key.fullname.toLowerCase().includes(filterName)
                  )
                  .filter((key) => key.date.toLowerCase().includes(filterDate))
                  .map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{nr++}</TableCell>
                      <TableCell>{appointment.fullname}</TableCell>
                      <TableCell>{appointment.cellphone}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
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
            pageCount={Math.ceil(appointments.length / appointmentsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageChange}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </Box>

        <Modal
          open={this.state.deleteModalOpen}
          onClose={this.handleModalClose}
        >
          <div className={classes.modalContent}>
            <Typography variant="h6" color="primary">
              Deleting Appointment
            </Typography>
            <Typography variant="h6">
              Are you sure you want to delete appointment with client:
            </Typography>
            <Typography variant="h5">{fullname}</Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.handleModalClose();
                  this.deleteAppointment(appointment._id);
                }}
                className={classes.modalButtons}
              >
                Yes
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
          <div className={classes.modalContent}>
            <Typography variant="h6" color="primary">
              Editing Appointment
            </Typography>
            <Typography variant="h5" color="secondary">
              Client: {fullname}
            </Typography>
            <form>
              <Box mt={2}>
                <TextField
                  id="editDate"
                  name="editDate"
                  type="date"
                  variant="outlined"
                  defaultValue={date}
                  inputRef={this.dateInput}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  id="editTime"
                  name="editTime"
                  type="time"
                  variant="outlined"
                  inputRef={this.timeInput}
                  defaultValue={time}
                />
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.handleModalClose();
                    this.editAppointment();
                  }}
                  className={classes.modalButtons}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  onClick={this.handleModalClose}
                  className={classes.modalButtons}
                >
                  Back
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
