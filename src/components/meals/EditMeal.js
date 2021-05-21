import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import "./EditMeal.css";

export default function EditMeal(props) {
  const [mealState, updateMealState] = useState(props.meal);
  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/meals/${mealState._id}`)
      .then((result) => {
        console.log(result.data);
        updateMealState(result.data);
      })
      .catch((err) => {});
  }, []);

  const handleNameChange = (event) => {
    let text = event.target.value;
    console.log(text);
    let cloneMealState = JSON.parse(JSON.stringify(mealState));
    cloneMealState.name = text;

    updateMealState(cloneMealState);
  };

  const handleDescriptionChange = (event) => {
    let text = event.target.value;
    console.log(text);
    let cloneMealState = JSON.parse(JSON.stringify(mealState));
    cloneMealState.description = text;

    updateMealState(cloneMealState);
  };

  const handleIngChange = (event, index) => {
    let text = event.target.value;
    let cloneMealState = JSON.parse(JSON.stringify(mealState));
    cloneMealState.ingredients[index] = text;

    updateMealState(cloneMealState);
  };

  const removeIngredientInput = (e) => {
    e.preventDefault();
    let newMealState = JSON.parse(JSON.stringify(mealState));
    newMealState.ingredients.pop();
    updateMealState(newMealState);
  };

  const addIngredientInput = (e) => {
    e.preventDefault();
    let newMealState = JSON.parse(JSON.stringify(mealState));
    newMealState.ingredients.push("Ingredient");
    updateMealState(newMealState);
  };
  return (
    <>
      {mealState && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.onUpdate(mealState._id, e);
          }}
          id="edit-meal-form"
        >
          <button
            className="closeEditMealForm"
            onClick={(e) => {
              e.preventDefault();
              props.onCloseEditMealForm();
            }}
          >
            x
          </button>
          <label htmlFor="name">Meal Name</label>
          <input
            onChange={handleNameChange}
            type="text"
            name="name"
            id="name"
            value={`${mealState.name}`}
            required
          ></input>
          <label htmlFor="description">Description</label>
          <textarea
            onChange={handleDescriptionChange}
            type="text"
            name="description"
            id="description"
            value={`${mealState.description}`}
          ></textarea>
          <label htmlFor="ingredients">Ingredients</label>
          {mealState.ingredients.map((ing, i) => (
            <React.Fragment key={i}>
              <input
                onChange={(event) => handleIngChange(event, i)}
                type="text"
                name="ingredients"
                id="ingredients"
                value={`${ing}`}
                required
              />
            </React.Fragment>
          ))}
          <div className="add-remove-buttons">
            <button onClick={addIngredientInput}>Add Ingredient</button>
            <button onClick={removeIngredientInput}>Remove Ingredient</button>
          </div>
          <button type="submit">Update Meal</button>
        </form>
      )}
    </>
  );
}
