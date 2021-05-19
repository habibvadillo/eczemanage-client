import React from "react";

export default function Error(props) {
  return (
    <>
      <h1>Something went wrong</h1>
      <p>{props.error.code}</p>
      <p>{props.error.message}</p>
    </>
  );
}
