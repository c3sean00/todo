import React from "react";

export default function Row({ task, onDelete }) {
  return (
    <div>
      <span>{task.description}</span>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}