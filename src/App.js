import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory, withRouter } from "react-router-dom";
import Error from "./components/error/Error";
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

  const handleCreateMeal = (e) => {
    e.preventDefault();
    let newMeal = {
      name: e.target.name.value,
      ingredients:
        e.target.ingredients.length !== undefined
          ? []
          : e.target.ingredients.value,
      author: userState._id,
    };
    if (typeof newMeal.ingredients === "object") {
      e.target.ingredients.forEach((i) => {
        newMeal.ingredients.push(i.value);
      });
    }
    console.log(newMeal, "pressing button!");
    axios
      .post(`${config.API_URL}/api/createmeal`, newMeal, {
        withCredentials: true,
      })
      .then((meal) => {
        let newMealsState = [...mealsState];
        newMealsState.push(meal.data);
        updateMealsState(newMealsState);
        history.push("/meals");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteMeal = (id) => {
    console.log("deleting!");
    axios
      .delete(
        `${config.API_URL}/api/meals/${id}`,
        {},
        { withCredentials: true }
      )
      .then((result) => {
        let newMealsState = mealsState.filter((m) => m._id !== result.data._id);
        updateMealsState(newMealsState);
        history.push("/meals");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditMeal = (id, e) => {
    e.preventDefault();
    updateFetchingMealsState(true);
    let newMeal = {
      name: e.target.name.value,
      ingredients:
        e.target.ingredients.length !== undefined
          ? []
          : e.target.ingredients.value,
      author: userState._id,
    };
    if (typeof newMeal.ingredients === "object") {
      e.target.ingredients.forEach((i) => {
        newMeal.ingredients.push(i.value);
      });
    }
    console.log(newMeal);
    axios
      .patch(
        `${config.API_URL}/api/meals/${id}`,
        {
          name: newMeal.name,
          ingredients: newMeal.ingredients,
          author: newMeal.author,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        let edittedMeal = response.data;
        let newMealsState = mealsState.map((meal) => {
          if (edittedMeal._id === meal._id) {
            meal.name = edittedMeal.name;
            meal.ingredients.length = 0;
            edittedMeal.ingredients.forEach((i) => {
              meal.ingredients.push(i);
            });
          }
          return meal;
        });
        updateMealsState(newMealsState);
        updateFetchingMealsState(false);
        history.push("/meals");
      })
      .catch((err) => {});
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
        path="/newmeal"
        render={() => (
          <>
            <Header />
            <h1>New Meal</h1>
            <CreateMeal onCreate={handleCreateMeal} />
          </>
        )}
      />
      <Route
        path="/meals/edit/:id/"
        render={(routeProps) => (
          <>
            <Header />
            <EditMeal onUpdate={handleEditMeal} {...routeProps} />
          </>
        )}
      />
      <Route
        path="/meals/:id"
        render={(routeProps) => (
          <>
            <Header />
            <Meal onDelete={handleDeleteMeal} {...routeProps} />
          </>
        )}
      />
      <Route
        path="/meals"
        render={() => (
          <>
            <Header />
            <h1>Meals</h1>
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
