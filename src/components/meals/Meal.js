import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../../config";

export default function Meal(props) {
  const [mealState, updateMealState] = useState();
  let { id } = useParams();
  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/meals/${id}`, { withCredentials: true })
      .then((m) => {
        updateMealState(m.data);
      })
      .catch((err) => {});
  }, []);
  console.log(mealState);
  return (
    <div>
      {mealState && (
        <>
          <p>{mealState.name}</p>
          <ul>
            {mealState.ingredients.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <Link to={`/meals/edit/${mealState._id}`}>
            <button>Edit</button>
          </Link>
          <button
            onClick={() => {
              props.onDelete(mealState._id);
            }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
