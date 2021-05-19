import React from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/index";

export default function Meals(props) {
  console.log(props);
  let meals = props.loading ? (
    <Loading />
  ) : (
    props.meals.map((m) => (
      <div key={m.name}>
        <a href={`/meals/${m._id}`}>{m.name}</a>
        <ul>
          {m.ingredients.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    ))
  );
  return (
    <div>
      <Link to="/newmeal">New Meal</Link>
      {meals}
    </div>
  );
}
