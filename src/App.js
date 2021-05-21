import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, withRouter } from "react-router-dom";
import Signup from "./components/signup/Signup";
import Signin from "./components/signin/Signin";
import Home from "./components/home/Home";
import CreateMeal from "./components/meals/CreateMeal";
import EditMeal from "./components/meals/EditMeal";
import Meals from "./components/meals/Meals";
import Meal from "./components/meals/Meal";
import Header from "./components/header/Header";
import axios from "axios";
import Loading from "./components/Loading/index";
import config from "./config";

function App(props) {
  const history = useHistory();

  const [mealsState, updateMealsState] = useState(null);
  const [daysState, updateDaysState] = useState(null);
  const [todayState, updateTodayState] = useState(null);

  const [fetchingMealsState, updateFetchingMealsState] = useState(true);
  const [fetchingUserState, updateFetchingUserState] = useState(true);
  const [fetchingDaysState, updateFetchingDaysState] = useState(true);

  const [userState, updateUserState] = useState(null);
  const [errorState, updateErrorState] = useState(null);

  useEffect(() => {
    console.log("fetching user");
    axios
      .get(`${config.API_URL}/api/user`, { withCredentials: true })
      .then((response) => {
        updateUserState(response.data);
        updateFetchingUserState(false);
        console.log("user fetched");
        console.log("fetching meals and days");
        axios
          .get(`${config.API_URL}/api/meals`, { withCredentials: true })
          .then((result) => {
            updateMealsState(result.data);
            updateFetchingMealsState(false);
            console.log("meals fetched");
          })
          .catch((errorObj) => {
            updateFetchingMealsState(false);
            updateErrorState(errorObj.response.data);
          });
        axios
          .get(`${config.API_URL}/api/days`, { withCredentials: true })
          .then((result) => {
            updateDaysState(result.data.slice(-7));
            console.log("days fetched");
            updateTodayState(result.data[result.data.length - 1]);
            console.log("today fetched");
            updateFetchingDaysState(false);
          })
          .catch((errorObj) => {
            console.log(errorObj);
            updateFetchingDaysState(false);
            updateErrorState(errorObj);
          });
      })
      .catch((errorObj) => {
        updateFetchingUserState(false);
        updateFetchingDaysState(false);
        updateErrorState(errorObj.response.data);
      });
  }, []);

  const handleSignin = (e) => {
    e.preventDefault();
    let newUser = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    axios
      .post(`${config.API_URL}/api/signin`, newUser, { withCredentials: true })
      .then((user) => {
        console.log("Signed in as ", user);
        updateUserState(user.data);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
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
        history.push("/signin");
        console.log("Signed up as ", user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignout = () => {
    console.log("signing out!");
    axios
      .post(`${config.API_URL}/api/signout`, {}, { withCredentials: true })
      .then(() => {
        updateUserState(null);
        updateMealsState(null);
        updateTodayState(null);
        updateDaysState(null);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStartDay = () => {
    let newDay = {
      date: `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`,
      author: userState._id,
    };
    console.log(newDay);
    axios
      .post(`${config.API_URL}/api/day/start`, newDay, {
        withCredentials: true,
      })
      .then((result) => {
        updateTodayState(result.data);
      })
      .catch((errorObj) => {
        updateErrorState(errorObj);
      });
  };

  const handleAddSleep = (e, date) => {
    e.preventDefault();
    let miliseconds = e.target.hours.value * 60 * 60 * 1000;
    miliseconds += e.target.minutes.value * 60 * 1000;
    axios
      .patch(
        `${config.API_URL}/api/day/${date._id}`,
        { sleep: miliseconds },
        { withCredentials: true }
      )
      .then((result) => {
        updateTodayState(result.data);
      })
      .catch((errorObj) => {
        updateErrorState(errorObj.response.data);
      });
  };

  const handleAddMeals = (e, date) => {
    e.preventDefault();
    let meals = Array.from(
      e.target.meals.selectedOptions,
      (option) => option.value
    );
    console.log(meals);
    axios.patch(
      `${config.API_URL}/api/day/${date._id}`,
      { meals },
      { withCredentials: true }
    );
  };

  if (fetchingUserState || fetchingDaysState) {
    return <Loading />;
  }
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(routeProps) => {
          return (
            <Home
              onSignOut={handleSignout}
              onStart={handleStartDay}
              submitSleepDuration={handleAddSleep}
              submitMeals={handleAddMeals}
              {...routeProps}
            />
          );
        }}
      />
      <Route
        path="/signin"
        render={() => (
          <>
            <Header />
            <Signin onSignin={handleSignin} />
          </>
        )}
      />
      <Route
        path="/signup"
        render={() => (
          <>
            <Header />
            <Signup onSignup={handleSignup} />
          </>
        )}
      />
      <Route
        path="/meals/:id"
        render={(routeProps) => (
          <>
            <Header />
            <Meal {...routeProps} />
          </>
        )}
      />
      <Route
        path="/meals"
        render={() => (
          <>
            <Header />
            <Meals meals={mealsState} loading={fetchingMealsState} />
          </>
        )}
      />
      <Route path="/fast">
        <h1>Fast Details</h1>
      </Route>
      <Route path="sleep">
        <h1>Sleeps Details</h1>
      </Route>
    </Switch>
  );
}

export default withRouter(App);
