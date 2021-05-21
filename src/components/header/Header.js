import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

export default function Header() {
  let history = useHistory();

  return (
    <header>
      <button id="back-button" onClick={() => history.push("/")}>
        Back
      </button>
    </header>
  );
}
