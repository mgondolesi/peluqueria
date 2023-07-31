import React from "react";
import clinic1 from "../images/foto-1.jpg";
import clinic2 from "../images/clinic-2.jpg";

function AboutUs() {
  return (
    <div className="container white-text">
      <h2 className="green-text">Sobre Nosotros</h2>
      <p>
        Acá podemos poner lo que querramos
      </p>
      <div className="row">
        <div className="col m6">
          <img src={clinic1} alt="clinic-1" className="responsive-img" />
        </div>
        <div className="col m6">
          <img src={clinic2} alt="clinic-2" className="responsive-img" />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
