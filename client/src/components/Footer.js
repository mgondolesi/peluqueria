import React from "react";

export default function Footer() {
  let year = new Date().getFullYear();
  return (
    <footer className="white-text">
        <p style={{position:"relative"}}>{year} &copy; Los Pibardos</p>
    </footer>
  )
}
