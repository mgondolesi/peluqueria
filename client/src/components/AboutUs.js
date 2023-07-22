import React from "react";
import clinic1 from "../images/clinic-1.jpg";
import clinic2 from "../images/clinic-2.jpg";

function AboutUs() {
  return (
    <div className="container white-text">
      <h2 className="green-text">Sobre Nosotros</h2>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
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
