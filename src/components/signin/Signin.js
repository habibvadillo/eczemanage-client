import React from "react";

export default function Signin(props) {
  return (
    <form onSubmit={props.onSignin}>
      <h2>Sign in</h2>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email"></input>
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password"></input>
      <button type="submit">Sign in</button>
    </form>
  );
}
