import React from "react";
import { Draggable } from "react-beautiful-dnd";

function Task({ item, index, droppableId }) {
  const grid = 8;
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <Draggable
      key={item.id}
      draggableId={`draggable-${item.id}`}
      index={index}
      droppableId={droppableId}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
