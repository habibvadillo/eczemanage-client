import React, { useState } from "react";

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
    <form onSubmit={props.onCreate}>
      <label htmlFor="name">Meal Name</label>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Name"
        required
      ></input>
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
      <button onClick={addIngredient}>Add Ingredient</button>
      <button onClick={removeIngredient}>Remove Ingredient</button>
      <button type="submit">Add Meal</button>
    </form>
  );
}
