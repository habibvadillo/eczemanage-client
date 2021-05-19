import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";

export default function EditMeal(props) {
  const [mealState, updateMealState] = useState();
  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/meals/${props.match.params.id}`)
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
        >
          <label htmlFor="name">Meal Name</label>
          <input
            onChange={handleNameChange}
            type="text"
            name="name"
            id="name"
            value={`${mealState.name}`}
            required
          ></input>
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
          <button onClick={addIngredientInput}>Add Ingredient</button>
          <button onClick={removeIngredientInput}>Remove Ingredient</button>
          <button type="submit">Update Meal</button>
        </form>
      )}
    </>
  );
}
