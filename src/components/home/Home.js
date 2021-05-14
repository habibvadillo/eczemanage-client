import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>AD Manager Main</h1>
      <Link to="newmeal">New Meal</Link>
      <Link to="fast">Fasts</Link>
      <Link to="sleep">Sleeps</Link>
      <Link to="signup">Sign Up</Link>
      <Link to="signin">Sign In</Link>
    </>
  );
}
