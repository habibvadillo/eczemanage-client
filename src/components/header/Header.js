import React from "react";
import { useHistory } from "react-router-dom";

export default function Header() {
  let history = useHistory();

  return (
    <header>
      <button onClick={() => history.push("/")}>Back</button>
    </header>
  );
}
