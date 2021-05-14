import React from "react";

export default function Signin() {
  return (
    <form action="/signin" method="POST">
      <h2>Sign in</h2>
      <label for="email">Email</label>
      <input type="text" id="email" name="email"></input>
      <label for="password">Password</label>
      <input type="text" id="password" name="password"></input>
      <button type="submit">Sign in</button>
    </form>
  );
}
