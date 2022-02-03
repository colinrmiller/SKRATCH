import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const grid = 8;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const PriorityColumn = (id, items) => {
  return (
    <Droppable droppableId={id}>
      key={id}
      {
        (provided, snapshot) =>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
          {
            items
              .filter((item) => item.tags.map((tag) => tag.id).inclues(id))
              ?.map((item, index) => (
                <Task item={item} index={index} droppableId={id} />
              ));
          }
        </div>
      }
    </Droppable>
  );
};

export default PriorityColumn;
