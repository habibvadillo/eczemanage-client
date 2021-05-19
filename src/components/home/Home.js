import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const [showSleepFormState, updateShowSleepFormState] = useState(false);
  const [showMealsFormState, updateShowMealsFormState] = useState(false);
  const [showMenuState, updateShowMenuState] = useState(false);

  const [daysMealsState, updateDaysMealsState] = useState(null);
  const [userMealsState, updateUserMealsState] = useState(null);
  const [daysState, updateDaysState] = useState(null);
  const [todayState, updateTodayState] = useState(null);
  const [sleepState, updateSleepState] = useState(null);

  const [fetchingMealsState, updateFetchingMealsState] = useState(true);
  const [fetchingUserState, updateFetchingUserState] = useState(true);
  const [fetchingDaysState, updateFetchingDaysState] = useState(true);

  const [userState, updateUserState] = useState(null);
  const [errorState, updateErrorState] = useState(null);

  useEffect(() => {
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
            updateUserMealsState(result.data);
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
            updateDaysMealsState(
              result.data[result.data.length - 1].meals.map((m) => m.name)
            );
            updateSleepState(result.data[result.data.length - 1].sleep);
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

  const handleChangeDay = (newDay) => {
    console.log("switch day to ", newDay.date);
    daysState.forEach((day) => {
      if (day._id === newDay._id) {
        updateTodayState(newDay);
        updateDaysMealsState(newDay.meals.map((m) => m.name));
        updateSleepState(newDay.sleep);
      }
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

  let sleepform = showSleepFormState ? (
    <form
      onSubmit={(e) => {
        updateShowSleepFormState(false);
        updateSleepState(
          e.target.hours.value * 60 * 60 * 1000 +
            e.target.minutes.value * 60 * 1000
        );
        props.submitSleepDuration(e, todayState);
      }}
    >
      <label htmlFor="hours">Hours</label>
      <input type="number" name="hours" id="hours"></input>
      <label htmlFor="minutes">Minutes</label>
      <input type="number" name="minutes" id="minutes"></input>
      <button type="submit">Submit</button>
    </form>
  ) : null;

  let mealsform = showMealsFormState ? (
    <form
      onSubmit={(e) => {
        updateShowMealsFormState(false);
        let newMeals = Array.from(
          e.target.meals.selectedOptions,
          (option) => option.innerText
        );
        console.log(newMeals, todayState);
        updateDaysMealsState(newMeals);
        let newDaysState = JSON.parse(JSON.stringify(daysState));
        newDaysState.forEach((day) => {
          if (day.date === todayState.date) {
            day.meals.length = 0;
            newMeals.forEach((meal) => {
              day.meals.push(meal);
            });
          }
        });
        updateDaysState(newDaysState);
        props.submitMeals(e, todayState);
      }}
    >
      <label htmlFor="meals">Meals</label>
      <select name="meals" id="meals" multiple>
        {userMealsState.map((meal) => {
          return (
            <option key={meal.name} value={meal._id}>
              {meal.name}
            </option>
          );
        })}
      </select>
      <button type="submit">Submit</button>
      <Link to="/newmeal">Create a new meal</Link>
    </form>
  ) : null;

  const showMenu = () => {
    updateShowMenuState(!showMenuState);
  };

  return (
    <>
      {showMenuState ? (
        <nav id="dropdown">
          <ul>
            {userState ? (
              <li
                onClick={() => {
                  updateUserState(null);
                  updateDaysMealsState(null);
                  updateTodayState(null);
                  updateDaysState(null);
                  updateShowMenuState(false);
                  props.onSignOut();
                }}
              >
                Signout
              </li>
            ) : null}
            <li>Privacy Policy</li>
            <li>About Us</li>
          </ul>
        </nav>
      ) : null}
      <header>
        <h1>AD Manager</h1>
        <button id="navButton" onClick={showMenu}>
          <i class="fa fa-bars"></i>
        </button>
      </header>
      {!userState ? (
        <>
          <p>Please start by signing up or signing in!</p>
          <div id="landing">
            <Link to="signup">Sign Up</Link>
            <p>or</p>
            <Link to="signin">Sign In</Link>
          </div>
        </>
      ) : (
        <>
          <div id="userInfo">
            <p>Hello {userState.name}</p>
          </div>
          {daysState && todayState ? (
            <>
              <ul id="days">
                {daysState.map((day) => {
                  if (day.date === todayState.date) {
                    return (
                      <li
                        className="active"
                        key={day.date}
                        onClick={() => handleChangeDay(day)}
                      >
                        {day.date.match(/\d*\/\d*/)}
                      </li>
                    );
                  } else {
                    return (
                      <li key={day.date} onClick={() => handleChangeDay(day)}>
                        {day.date.match(/\d*\/\d*/)}
                      </li>
                    );
                  }
                })}
              </ul>
              <div id="weekSummary">
                <p>
                  Your average sleep this week was{" "}
                  {(
                    daysState
                      .filter((day) => day.sleep)
                      .reduce((acc, elem, index, array) => {
                        return acc + elem.sleep / array.length;
                      }, 0) /
                    60 /
                    60 /
                    1000
                  ).toFixed(2)}
                  hrs
                </p>
              </div>
            </>
          ) : null}
          <div id="day">
            {!todayState ? (
              <>
                <button onClick={handleStartDay}>Start Your Day!</button>
              </>
            ) : null}
            {!sleepState ? (
              <>
                <button
                  onClick={() => {
                    updateShowSleepFormState(true);
                  }}
                >
                  Submit this nights sleep
                </button>
                {sleepform}
              </>
            ) : (
              <>
                <p>
                  You got {(sleepState / 3600000).toFixed(2)}hrs of Sleep this
                  night
                </p>
                <button
                  onClick={() => {
                    updateShowSleepFormState(true);
                  }}
                >
                  Edit
                </button>
                {sleepform}
              </>
            )}
            {!daysMealsState ? (
              <>
                <button
                  onClick={() => {
                    updateShowMealsFormState(true);
                  }}
                >
                  What did you eat on this day?
                </button>
                {mealsform}
              </>
            ) : daysMealsState.length === 0 ? (
              <>
                <p>You havent added any meals for this day</p>
                <button
                  onClick={() => {
                    updateShowMealsFormState(true);
                  }}
                >
                  Add one
                </button>
                {mealsform}
              </>
            ) : (
              <>
                <p>Today, you had</p>
                <ul>
                  {daysMealsState.map((meal) => (
                    <li key={meal}>{meal}</li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    updateShowMealsFormState(true);
                  }}
                >
                  Edit
                </button>
                {mealsform}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
