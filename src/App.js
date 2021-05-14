import React from "react";
import { Switch, Route } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Signin from "./components/signin/Signin";
import Home from "./components/home/Home";
import axios from "axios";
import config from "./config";

function App() {
  const handleSignin = (e) => {
    let newUser = {
      email: e.target.name.value,
      password: e.target.password.value,
    };
    axios
      .post(`${config.API_URL}/api/signin`, newUser, { withCredentials: true })
      .then((user) => {
        console.log("Signed in as ", user);
      })
      .catch((err) => {});
  };

  const handleSignup = (e) => {
    e.preventDefault();
    let newUser = {
      name: `${e.target.firstname.value} ${e.target.lastname.value}`,
      username: e.target.username.value,
      dob: e.target.dob.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    axios
      .post(`${config.API_URL}/api/signup`, newUser, { withCredentials: true })
      .then((user) => {
        console.log("Signed up as ", user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Switch>
      <Route exact path="/" render={() => <Home />}></Route>
      <Route
        path="/signin"
        render={() => <Signin onSignin={handleSignin} />}
      ></Route>
      <Route
        path="/signup"
        render={() => <Signup onSignup={handleSignup} />}
      ></Route>
      <Route path="/newmeal">
        <h1>New Meal</h1>
      </Route>
      <Route path="/fast">
        <h1>Fast Details</h1>
      </Route>
      <Route path="sleep">
        <h1>Sleeps Details</h1>
      </Route>
    </Switch>
  );
}

export default App;
