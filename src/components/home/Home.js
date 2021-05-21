import React, { useState, useEffect } from "react";
import WeekSleep from "../weeksleep/WeekSleep";
import CreateMeal from "../meals/CreateMeal";
import EditMeal from "../meals/EditMeal";
import Meal from "../meals/Meal";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = (props) => {
  const [showSleepFormState, updateShowSleepFormState] = useState(false);
  const [showMealsFormState, updateShowMealsFormState] = useState(false);
  const [showMealDetailsState, updateShowMealDetailsState] = useState(false);
  const [showCreateMealFormState, updateShowCreateMealFormState] =
    useState(false);
  const [showEditMealFormState, updateShowEditMealFormState] = useState(false);
  const [showMenuState, updateShowMenuState] = useState(false);

  const [mealEdittingState, updateMealEdittingState] = useState(null);
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

  const handleCreateMeal = (e) => {
    e.preventDefault();
    let newMeal = {
      name: e.target.name.value,
      ingredients:
        e.target.ingredients.length !== undefined
          ? []
          : e.target.ingredients.value,
      description: e.target.description.value,
      author: userState._id,
    };
    console.log(newMeal);
    if (typeof newMeal.ingredients === "object") {
      e.target.ingredients.forEach((i) => {
        newMeal.ingredients.push(i.value);
      });
    }
    axios
      .post(`${config.API_URL}/api/createmeal`, newMeal, {
        withCredentials: true,
      })
      .then((meal) => {
        let newMealsState = [...userMealsState];
        newMealsState.push(meal.data);
        updateUserMealsState(newMealsState);
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
      description: e.target.description.value,
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
          description: newMeal.description,
          author: newMeal.author,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        let edittedMeal = response.data;
        let newMealsState = userMealsState.map((meal) => {
          if (edittedMeal._id === meal._id) {
            meal.name = edittedMeal.name;
            meal.description = edittedMeal.description;
            meal.ingredients.length = 0;
            edittedMeal.ingredients.forEach((i) => {
              meal.ingredients.push(i);
            });
          }
          return meal;
        });
        updateUserMealsState(newMealsState);
        updateFetchingMealsState(false);
      })
      .catch((err) => {});
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
        let newMealsState = userMealsState.filter(
          (m) => m._id !== result.data._id
        );
        updateUserMealsState(newMealsState);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let sleepform = showSleepFormState ? (
    <div className="my-modal">
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
          x
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  ) : null;

  let mealsform = showMealsFormState ? (
    <div className="my-modal">
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
        <label htmlFor="meals">Select Meals</label>
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
          x
        </button>
        <button type="submit">Submit</button>
        <p>
          If you would like to create a brand new meal click{" "}
          <Link to="/newmeal">here</Link>
        </p>
      </form>
    </div>
  ) : null;

  let createMealForm = showCreateMealFormState ? (
    <div className="my-modal">
      <CreateMeal
        onCreate={(e) => {
          updateShowCreateMealFormState(false);
          handleCreateMeal(e);
        }}
        onCloseCreateMealForm={() => {
          updateShowCreateMealFormState(false);
        }}
      />
    </div>
  ) : null;

  let editMealForm = showEditMealFormState ? (
    <div className="my-modal">
      {mealEdittingState && (
        <EditMeal
          onUpdate={(id, e) => {
            handleEditMeal(id, e);
            updateShowEditMealFormState(false);
          }}
          meal={mealEdittingState}
          onCloseEditMealForm={() => {
            updateShowEditMealFormState(false);
          }}
        />
      )}
    </div>
  ) : null;

  let mealDetails = showMealDetailsState ? (
    <div className="my-modal">
      {mealEdittingState && (
        <Meal
          meal={mealEdittingState}
          onEditMealDetails={() => {
            updateShowMealDetailsState(false);
            updateShowEditMealFormState(true);
          }}
          onDelete={() => {
            handleDeleteMeal(mealEdittingState._id);
            updateShowMealDetailsState(false);
          }}
          onCloseMealDetails={() => {
            updateShowMealDetailsState(false);
          }}
        />
      )}
    </div>
  ) : null;

  const showMenu = () => {
    updateShowMenuState(!showMenuState);
  };

  return (
    <>
      {showMenuState ? (
        <nav id="dropdown">
          <button className="navButton" onClick={showMenu}>
            <i className="fa fa-bars"></i>
          </button>
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
          <footer>&#169; Copyright 2021</footer>
        </nav>
      ) : null}
      <header>
        <button className="navButton" onClick={showMenu}>
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
            <h1>Hello {userState.name}</h1>
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
                <h2>
                  {todayState.day} {todayState.date}
                </h2>
                <div id="sleep">
                  <h3>How you slept</h3>
                  {!sleepState ? (
                    <>
                      <p>You havent logged this sleep</p>
                      {!showSleepFormState ? (
                        <button
                          onClick={() => {
                            updateShowSleepFormState(true);
                          }}
                        >
                          Add Sleep
                        </button>
                      ) : null}
                      {sleepform}
                    </>
                  ) : (
                    <>
                      <p>
                        You had{" "}
                        <strong>{(sleepState / 3600000).toFixed(2)}hrs</strong>{" "}
                        of Sleep
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
                  <h3>What you ate: </h3>
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
                      <p>No meals recorded</p>
                      <button
                        onClick={() => {
                          updateShowMealsFormState(true);
                        }}
                      >
                        Add Meal
                      </button>
                      {mealsform}
                    </>
                  ) : (
                    <>
                      <p>You had</p>
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
                        Edit Meals
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
          {userMealsState ? (
            <div id="meals-container">
              {createMealForm}
              {editMealForm}
              {mealDetails}
              <h2>Your Favorite Meals</h2>
              <div id="your-meals">
                {userMealsState.map((m, i) => (
                  <div key={m.name} className="each-meal">
                    <h4
                      onClick={() => {
                        updateMealEdittingState(m);
                        updateShowMealDetailsState(true);
                      }}
                    >
                      {m.name}
                    </h4>
                    <p>
                      <em>{m.description}</em>
                    </p>
                    <div className="meal-list-buttons">
                      <button
                        className="edit-meal-button"
                        onClick={() => {
                          updateMealEdittingState(m);
                          updateShowEditMealFormState(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-meal-button"
                        onClick={() => {
                          handleDeleteMeal(m._id);
                        }}
                      >
                        Delete Meal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                id="create-new-meal-button"
                onClick={() => {
                  updateShowCreateMealFormState(true);
                }}
              >
                Create New Meal
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Home;
