import React from "react";
import "./Signup.css";

const Signin = (props) => {
  return (
    <form onSubmit={props.onSignup}>
      <h2>Sign Up</h2>
      <label htmlFor="firstname">First Name</label>
      <input type="text" id="firstname" name="firstname"></input>
      <label htmlFor="lastname">Last Name</label>
      <input type="text" id="lastname" name="lastname"></input>
      <label htmlFor="dob">Date of Birth</label>
      <input type="date" id="dob" name="dob"></input>
      <label htmlFor="username">Choose a username</label>
      <input type="text" id="username" name="username"></input>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email"></input>
      <label htmlFor="password">Create Password</label>
      <input type="text" id="password" name="password"></input>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signin;
