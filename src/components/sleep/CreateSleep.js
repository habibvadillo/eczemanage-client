import React from "react";

export default function CreateSleep() {
  return (
    <form>
      <label htmlFor="hours"></label>
      <input type="number" name="hours" id="hours" value="0" />
      <label htmlFor="minutes"></label>
      <input type="number" name="minutes" id="minutes" value="0" />
    </form>
  );
}
