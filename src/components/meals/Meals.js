import React from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/index";
import "./Meals.css";

export default function Meals(props) {
  console.log(props);
  let meals =
    props.loading && props.meals ? (
      <Loading />
    ) : props.meals.length < 1 ? (
      <p id="no-meals-message">You don't have any meals yet</p>
    ) : (
      <div id="meal-list">
        {props.meals.map((m, i) => (
          <div key={m.name} className="single-meal">
            <a href={`/meals/${m._id}`}>{m.name}</a>
            <p>Ingredients</p>
            <ul>
              {m.ingredients.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  return (
    <div id="main-meals">
      <h1>Meals</h1>
      {meals}
      <Link id="new-meal" to="/newmeal">
        New Meal
      </Link>
    </div>
  );
}
