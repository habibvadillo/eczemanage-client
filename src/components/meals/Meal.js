import axios from "axios";
import React, { useState, useEffect } from "react";
import config from "../../config";
import "./Meal.css";

export default function Meal(props) {
  const [mealState, updateMealState] = useState();
  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/meals/${props.meal._id}`, {
        withCredentials: true,
      })
      .then((m) => {
        updateMealState(m.data);
      })
      .catch((err) => {});
  }, []);
  console.log(mealState);
  return (
    <div id="meal-details">
      {mealState && (
        <>
          <button
            className="closeMealDetails"
            onClick={(e) => {
              e.preventDefault();
              props.onCloseMealDetails();
            }}
          >
            x
          </button>
          <h2>{mealState.name}</h2>
          <div id="meal-info-container">
            <div id="description-container">
              <h4>Description</h4>
              <p>{mealState.description}</p>
            </div>
            <div>
              <h4>Ingredients</h4>
              <ul id="meal-ingredients-list">
                {mealState.ingredients.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
          <div id="meal-details-buttons">
            <button
              className="edit-meal-button"
              onClick={() => {
                props.onEditMealDetails();
              }}
            >
              Edit
            </button>
            <button
              className="delete-meal-button"
              onClick={() => {
                props.onDelete();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
