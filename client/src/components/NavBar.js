import React, { Component } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css/dist/js/materialize.min.js";
import logo from "./../images/logo.png";

class NavBar extends Component {
  state = {
    isAuthenticated: false
  };
  componentDidMount() {
    M.AutoInit();
    const token = localStorage.getItem("lcl-stg-tkn");
    if (token) {
      this.setState({
        isAuthenticated: true
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState({ isAuthenticated: true });
    }
  }

  logout = () => {
    localStorage.removeItem("lcl-stg-tkn");
    this.setState({
      isAuthenticated: false
    });
  };
  closeSidenav = () => {
    const sidenav = M.Sidenav.getInstance(
      document.getElementById("nav-mobile")
    );
    sidenav.close();
  };
  render() {
    const { isAuthenticated } = this.state;
    return (
      <div>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper teal darken-2">
              <div className="container test">
                <div className="brand-logo left">
                  <Link to="/">
                    <img src={logo} alt="logo" className="logo" />
                  </Link>
                </div>
                <a
                  href="#!"
                  data-target="nav-mobile"
                  className="sidenav-trigger right"
                >
                  <i className="material-icons">menu</i>
                </a>
                <ul className="right hide-on-med-and-down">
                  <li>
                    <Link to="/dashboard">Administrar turnos</Link>
                  </li>
                  <li>
                    <Link to="/about">Sobre Nosotros</Link>
                  </li>
                  {isAuthenticated ? (
                    <li>
                      <Link to="/login" onClick={this.logout}>
                        Cerrar Sesion
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <ul id="nav-mobile" className="sidenav">
          <li>
            <Link to="/dashboard" onClick={this.closeSidenav}>
              Administrar turnos
            </Link>
          </li>
          <li className="divider"></li>
          <li>
            <Link to="/about" onClick={this.closeSidenav}>
              Sobre Nosotros
            </Link>
          </li>
          <li className="divider"></li>
          {isAuthenticated ? (
            <li>
              <Link
                to="/login"
                onClick={() => {
                  this.logout();
                  this.closeSidenav();
                }}
              >
                Cerrar Sesion
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}

export default NavBar;
