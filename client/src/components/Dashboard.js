import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import spinner from "../images/loading.gif";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      filterName: "",
      filterDate: "",
      appointment: {},
      loading: false,
      isAuthenticated: false
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
        isAuthenticated: true
      });

      axios
        .get("/appointments", {
          headers: {
            "Content-type": "application/json",
            "x-auth-token": token
          }
        })
        .then(res =>
          this.setState({
            appointments: res.data,
            loading: false
          })
        )
        .catch(err => console.log(err));
    } else {
      this.props.history.push("/login");
    }
  };
  deleteAppointment = id => {
    axios
      .delete(`/appointment/${id}`, {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": localStorage.getItem("lcl-stg-tkn")
        }
      })
      .then(res => {
        const objToDeleteIndex = this.state.appointments.findIndex(
          obj => obj._id === id
        );
        const newItems = [...this.state.appointments];
        newItems.splice(objToDeleteIndex, 1);
        this.setState({ appointments: newItems });
        M.toast({ html: res.data.msg, classes: "green darken-1 rounded" });
      })
      .catch(err => console.log(err));
  };
  editAppointment = () => {
    const { _id } = this.state.appointment;
    const updatedValues = {
      date: this.dateInput.current.value,
      time: this.timeInput.current.value
    };

    axios
      .put(`/appointment/${_id}`, updatedValues, {
        headers: {
          "Content-type": "application/json",
          "x-auth-token": localStorage.getItem("lcl-stg-tkn")
        }
      })
      .then(res => {
        const objToEditIndex = this.state.appointments.findIndex(
          obj => obj._id === _id
        );
        const newItems = [...this.state.appointments];
        newItems[objToEditIndex].date = updatedValues.date;
        newItems[objToEditIndex].time = updatedValues.time;
        this.setState({ appointments: newItems });

        M.toast({ html: res.data.msg, classes: "green darken-1 rounded" });
      })
      .catch(err => console.log(err));
  };
  render() {
    let nr = 1;
    const { filterName, filterDate, loading, appointment } = this.state;
    const { fullname, date, time } = this.state.appointment;
    return (
      <div className="row dashboard">
        <div className="col m10 offset-m1">
          <div className="green-text darken-2">
            <h4> Manage Appointments</h4>
            <h6>Total Apointments: {this.state.appointments.length}</h6>
          </div>
          <div className="row">
            <div className="input-field col">
              <input
                id="fullname"
                type="text"
                className="validate"
                value={filterName}
                onChange={e => this.setState({ filterName: e.target.value })}
              />
              <label htmlFor="fullname">
                <i className="material-icons left">find_in_page</i> Search by
                name
              </label>
            </div>
            <div className="input-field col">
              <input
                id="date"
                type="text"
                className="validate"
                value={filterDate}
                onChange={e => this.setState({ filterDate: e.target.value })}
              />
              <label htmlFor="date">Search by date</label>
            </div>
          </div>
          {loading ? (
            <div className="center">
              <img src={spinner} alt="spiner" />
            </div>
          ) : (
            <table className="striped responsive-table blue-grey darken-2 white-text">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Full Name</th>
                  <th>Cellphone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th style={{ width: "300px" }}>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.appointments
                  .filter(key =>
                    key.fullname.toLowerCase().includes(filterName)
                  )
                  .filter(key => key.date.toLowerCase().includes(filterDate))
                  .map(appointment => (
                    <tr key={appointment._id}>
                      <td>{nr++}</td>
                      <td>{appointment.fullname}</td>
                      <td>{appointment.cellphone}</td>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.description}</td>
                      <td>
                        <button
                          className="waves-effect red waves-light btn modal-trigger"
                          href="#deleteModal"
                          onClick={() => this.setState({ appointment })}
                        >
                          <i className="material-icons right">delete</i>
                          Cancel{" "}
                        </button>
                      </td>
                      <td>
                        <button
                          className="waves-effect waves-light btn modal-trigger"
                          href="#editModal"
                          onClick={() => this.setState({ appointment })}
                        >
                          <i className="material-icons right">edit</i>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {/*Delete Modal*/}
          <div id="deleteModal" className="modal">
            <div className="modal-content">
              <h4 className="center">Deleting Appointment</h4>
              Are you sure you want to delete appointment with client:
              <h4>{fullname}</h4>
            </div>
            <div className="modal-footer">
              <Link
                to="/dashboard"
                className="modal-close waves-effect red waves-light btn"
                style={{ marginRight: "10px" }}
                onClick={this.deleteAppointment.bind(this, appointment._id)}
              >
                Yes
              </Link>
              <Link
                to="/dashboard"
                className="modal-close waves-effect waves-light btn"
              >
                No
              </Link>
            </div>
          </div>
          {/* Edit Modal*/}
          <div id="editModal" className="modal">
            <div className="modal-content">
              <h4 className="center">Editing Appointment</h4>
              <h5 className="center">Client: {fullname} </h5>
              <form>
                <div className="row">
                  <div className="input-field col m8 offset-m2">
                    <i className="material-icons prefix">event</i>
                    <input
                      id="editDate"
                      name="editDate"
                      type="date"
                      className="validate"
                      defaultValue={date}
                      ref={this.dateInput}
                    />
                    <label htmlFor="editDate">Date</label>
                  </div>
                  <div className="input-field col m8 offset-m2">
                    <i className="material-icons prefix">access_time</i>
                    <input
                      id="editTime"
                      name="editTime"
                      type="time"
                      className="validate"
                      ref={this.timeInput}
                      defaultValue={time}
                    />
                    <label htmlFor="editTime">Time</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <Link
                to="/dashboard"
                className="modal-close waves-effect red waves-light btn"
                style={{ marginRight: "10px" }}
                onClick={this.editAppointment}
              >
                Submit
              </Link>
              <Link
                to="/dashboard"
                className="modal-close waves-effect waves-light btn"
              >
                Back
              </Link>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
