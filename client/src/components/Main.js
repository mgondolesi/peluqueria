import React, { Component } from "react";
import axios from "axios";
import M from "materialize-css/dist/js/materialize.min.js";
import bg from "../images/dentist.png";

class Main extends Component {
  state = {
    fullname: "",
    cellphone: "",
    date: "",
    time: "",
    description: "",
    errorMessage: "",
    successMessage: ""
  };
  componentDidMount() {
    M.AutoInit();
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  makeAppointment = e => {
    e.preventDefault();

    const { fullname, cellphone, date, time, description } = this.state;
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
        this.setState({
          successMessage: result.data.msg,
          fullname: "",
          cellphone: "",
          date: "",
          time: "",
          description: ""
        });
        M.toast({
          html: this.state.successMessage,
          classes: "green darken-1 rounded"
        });
      })
      .catch(error => {
        this.setState({ errorMessage: error.response.data.msg });
        M.toast({
          html: this.state.errorMessage,
          classes: "red darken-1 rounded"
        });
      });
  };
  resetForm = () => {
    this.setState({
      fullname: "",
      cellphone: "",
      date: "",
      time: "",
      description: ""
    });
  };
  render() {
    const { fullname, cellphone, date, time, description } = this.state;
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
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
                      />
                      <label htmlFor="date">Date</label>
                    </div>
                    <div className="input-field">
                      <i className="material-icons prefix">access_time</i>
                      <input
                        id="time"
                        name="time"
                        type="time"
                        className="validate"
                        value={time}
                        onChange={this.handleChange}
                      />
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
                        onChange={this.handleChange}
                      ></textarea>
                      <label htmlFor="description">How can we help you?</label>
                    </div>
                    <div className="card-action">
                      <button
                        className="waves-effect waves-light btn s12 m8"
                        style={{ margin: "5px" }}
                        onClick={this.makeAppointment}
                      >
                        <i className="material-icons right">send</i>Book
                        Appointment
                      </button>
                      <button
                        type="reset"
                        className="waves-effect red waves-light btn"
                        onClick={this.resetForm}
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
}

export default Main;
