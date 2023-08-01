import React from "react";
import clinic1 from "../images/foto-1.jpg";
import clinic2 from "../images/clinic-2.jpg";

function AboutUs() {
  return (
    <div className="container white-text">
      <h2 className="green-text">Sobre Nosotros</h2>
      <p>
        ¡Bienvenidos a Salvador Estilistas!
        <br></br>
        <br></br>
        Salvador es un apasionado estilista que te ofrece su experiencia y talento para transformar tu imagen. Nos preocupamos por tu comodidad y conveniencia, por lo que trabajamos con turnos previos de martes a sábados, de 10:00 a 20:00 horas. 
        <br></br>
        <br></br>
        Especializado en cortes de pelo para hombres y mujeres, así como servicios de color, Salvador se dedica a realzar tu belleza de una manera única y personalizada. Con su creatividad y habilidades técnicas, te asegura un resultado que te hará lucir espectacular y resaltar tu estilo único.
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
