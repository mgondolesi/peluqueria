import React, { Component } from "react";
import axios from "axios";
import M from "materialize-css/dist/js/materialize.min.js";

class Login extends Component {
  state = {
    username: "",
    password: "",
    isAuthenticated: false,
    user: null,
    token: null
  };
  componentDidMount() {
    M.AutoInit();
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      // 13 es el código de la tecla Enter
      this.login();
    }
  };

  login = () => {
    const { username, password } = this.state;
    const newUser = { username, password };

    axios
      .post("/login", newUser)
      .then(res => {
        localStorage.setItem("lcl-stg-tkn", res.data.token);
        this.setState({
          isAuthenticated: true,
          user: res.data.user,
          token: localStorage.getItem("lcl-stg-tkn")
        });
        this.props.verifyAuth(this.state.isAuthenticated);
        this.props.history.push("/dashboard");
      })
      .catch(err =>
        M.toast({
          html: err.response.data.msg,
          classes: "red darken-1 rounded"
        })
      );
  };

  render() {
    const { username, password } = this.state;
    return (
      <div className="row middle">
        <div className="col s12 m6 offset-m3">
          <div className="card blue-grey darken-2">
            <div className="card-content white-text">
              <i className="material-icons center" style={{ fontSize: "50px" }}>
                lock_outline
              </i>
              <h4 className="center">Login</h4>
              <form style={{ width: "70%", margin: "auto" }}>
                <div className="row">
                  <div className="input-field">
                    <i className="material-icons prefix">person</i>
                    <input
                      id="username"
                      type="text"
                      className="validate"
                      value={username}
                      onChange={e =>
                        this.setState({ username: e.target.value })
                      }
                    />
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="input-field ">
                    <i className="material-icons prefix">keyboard</i>
                    <input
                      id="password"
                      type="password"
                      className="validate"
                      value={password}
                      onChange={e =>
                        this.setState({ password: e.target.value })
                      }
                      onKeyDown={this.handleKeyPress}
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                </div>
              </form>
            </div>
            <div className="card-action center">
              <button
                className="waves-effect waves-light darken-2 btn"
                onClick={this.login}
                style={{ marginRight: "6px" }}
              >
                <i className="material-icons right">send</i>Login
              </button>
              <button
                className="waves-effect red waves-light btn"
                onClick={() => this.setState({ username: "", password: "" })}
              >
                <i className="material-icons right">clear</i>Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
