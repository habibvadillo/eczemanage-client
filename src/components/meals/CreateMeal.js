import React, { useState } from "react";
import "./CreateMeal.css";

export default function CreateMeal(props) {
  const [ingreInputState, updateIngreInputState] = useState({
    ingreInputs: [0],
  });

  const addIngredient = (e) => {
    e.preventDefault();
    let newIngreInputs = [...ingreInputState.ingreInputs];
    newIngreInputs.push(newIngreInputs.length + 1);
    updateIngreInputState({
      ingreInputs: newIngreInputs,
    });
  };
  const removeIngredient = (e) => {
    e.preventDefault();
    let newIngreInputs = [...ingreInputState.ingreInputs];
    newIngreInputs.pop();
    updateIngreInputState({
      ingreInputs: newIngreInputs,
    });
  };
  return (
    <form onSubmit={props.onCreate} className="create-meal-form">
      <button
        className="closeCreateMealForm"
        onClick={(e) => {
          e.preventDefault();
          props.onCloseCreateMealForm();
        }}
      >
        x
      </button>
      <h3>Create Meal</h3>
      <label htmlFor="name">Meal Name</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name"
        required
      ></input>
      <label htmlFor="description">Meal Description</label>
      <textarea
        type="text"
        name="description"
        id="description"
        placeholder="Description"
      ></textarea>
      <label htmlFor="ingredients">Ingredients</label>
      {ingreInputState.ingreInputs.map((inp, i) => (
        <React.Fragment key={i}>
          <input
            type="text"
            name="ingredients"
            id="ingredients"
            placeholder="Ingredient Name"
            required
          />
        </React.Fragment>
      ))}
      <div className="add-remove-buttons">
        <button onClick={addIngredient}>Add Ingredient</button>
        <button onClick={removeIngredient}>Remove Ingredient</button>
      </div>
      <button type="submit">Add Meal</button>
    </form>
  );
}
