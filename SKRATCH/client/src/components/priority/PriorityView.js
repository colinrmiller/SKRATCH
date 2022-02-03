import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getPriorities } from "../../modules/TagManager";
import PriorityColumn from "./PriorityColumn";
// fake data generator
// const getItems = (count) =>
//   Array.from({ length: count }, (v, k) => k).map((k) => ({
//     id: `item-${k}`,
//     content: `item ${k}`,
//   }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const PriorityView = ({ notes }) => {
  const [items, setItems] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [assignedItems, setAssignedItems] = useState({});

  useEffect(() => {
    setItems(notes);
  }, [notes]);

  useEffect(() => {
    getPriorities().then((res) => {
      setPriorities(res);
    });
  }, []);

  useEffect(() => {
    const asignments = {};
    priorities.forEach((priority) => {
      const filteredItems = items.filter((item) =>
        item.tags.map((tag) => tag.id).includes(priority.id)
      );
      asignments[priority.id] = filteredItems;
    });
    setAssignedItems(asignments);
  }, [items]);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    // this.setState({
    //   items
    // });

    setItems(newItems);
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    // <></>
    <DragDropContext onDragEnd={onDragEnd}>
      {priorities.map((priority) => (
        <PriorityColumn
          id={priority.id}
          items={assignedItems[priority.id]}
          key={priority.id}
        />
      ))}
    </DragDropContext>
  );
};

export default PriorityView;
