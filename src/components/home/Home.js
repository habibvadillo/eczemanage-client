import React, { useState, useEffect } from "react";
import WeekSleep from "../weeksleep/WeekSleep";
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
  const [weekState, updateWeekState] = useState(null);
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
            console.log(
              result.data.sort((a, b) => a.date.localeCompare(b.date)).slice(-7)
            );
            updateWeekState(
              result.data.sort((a, b) => a.date.localeCompare(b.date)).slice(-7)
            );
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
      .catch((err) => {
        updateFetchingUserState(false);
        updateFetchingDaysState(false);
        console.log(err);
      });
  }, []);

  const handleChangeDay = (newDay) => {
    console.log("switch day to ", newDay.date);
    weekState.forEach((day) => {
      if (day._id === newDay._id) {
        console.log(newDay.meals);
        updateTodayState(newDay);
        updateDaysMealsState(
          newDay.meals.map((m) => {
            if (typeof m === "string") {
              return m;
            } else {
              return m.name;
            }
          })
        );
        updateSleepState(newDay.sleep || 0);
        updateShowSleepFormState(false);
        updateShowMealsFormState(false);
      }
    });
  };

  let sleepform = showSleepFormState ? (
    <form
      id="sleep-form"
      onSubmit={(e) => {
        let newSleep =
          e.target.hours.value * 60 * 60 * 1000 +
          e.target.minutes.value * 60 * 1000;
        updateShowSleepFormState(false);
        updateSleepState(newSleep);
        let newDays = JSON.parse(JSON.stringify(weekState));
        newDays.forEach((day) => {
          if (day._id === todayState._id) {
            day.sleep = newSleep;
          }
        });
        updateWeekState(newDays);
        let newTodayState = JSON.parse(JSON.stringify(todayState));
        newTodayState.sleep = newSleep;
        console.log(newTodayState);
        updateTodayState(newTodayState);
        props.submitSleepDuration(e, todayState);
      }}
    >
      <h3>Edit Sleep for {todayState.date}</h3>
      <label htmlFor="hours">Hours</label>
      <input type="number" name="hours" id="hours"></input>
      <label htmlFor="minutes">Minutes</label>
      <input type="number" name="minutes" id="minutes"></input>
      <button
        id="closeSleepForm"
        onClick={(e) => {
          e.preventDefault();
          updateShowSleepFormState(false);
        }}
      >
        Close
      </button>
      <button type="submit">Submit</button>
    </form>
  ) : null;

  let mealsform = showMealsFormState ? (
    <form
      id="meals-form"
      onSubmit={(e) => {
        updateShowMealsFormState(false);
        let newMeals = Array.from(
          e.target.meals.selectedOptions,
          (option) => option.innerText
        );
        console.log(newMeals, todayState);
        updateDaysMealsState(newMeals);
        let newDaysState = JSON.parse(JSON.stringify(weekState));
        newDaysState.forEach((day) => {
          if (day.date === todayState.date) {
            day.meals.length = 0;
            newMeals.forEach((meal) => {
              day.meals.push(meal);
            });
          }
        });
        updateWeekState(newDaysState);
        props.submitMeals(e, todayState);
      }}
    >
      <h3>Edit meals from {todayState.date}</h3>
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
      <button
        id="closeMealsForm"
        onClick={(e) => {
          e.preventDefault();
          updateShowMealsFormState(false);
        }}
      >
        Close
      </button>
      <button type="submit">Submit</button>
      <p>
        If you would like to create a brand new meal click{" "}
        <Link to="/newmeal">here</Link>
      </p>
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
                  updateWeekState(null);
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
          <i className="fa fa-bars"></i>
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
          {weekState && todayState ? (
            <>
              <ul id="days">
                {weekState.map((day) => {
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
            </>
          ) : null}
          <div id="day">
            {todayState ? (
              <>
                <div id="sleep">
                  <h3>Your Sleep</h3>
                  {!sleepState ? (
                    <>
                      <p>You havent logged this night's sleep</p>
                      {!showSleepFormState ? (
                        <button
                          onClick={() => {
                            updateShowSleepFormState(true);
                          }}
                        >
                          Submit sleep
                        </button>
                      ) : null}
                      {sleepform}
                    </>
                  ) : (
                    <>
                      <p>
                        You got {(sleepState / 3600000).toFixed(2)}hrs of Sleep
                        this night
                      </p>
                      {!showSleepFormState ? (
                        <button
                          onClick={() => {
                            updateShowSleepFormState(true);
                          }}
                        >
                          Edit Sleep
                        </button>
                      ) : null}
                      {sleepform}
                    </>
                  )}
                </div>
                <div id="meals">
                  <h3>Your Meals</h3>
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
                      <p>On this day, you had</p>
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
            ) : null}
          </div>
          {weekState && todayState ? (
            <div id="weekSummary">
              <h2>Your weekly sleep chart</h2>
              <p>
                Average:
                {(
                  weekState
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
              <WeekSleep
                days={weekState.map((day) => day.date)}
                sleep={weekState.map((day) => day.sleep / 3600000)}
              ></WeekSleep>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Home;
