import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import DraggableElement from "./DraggableElement";

const DragDropContextContainer = styled.div`
  padding: 20px;
  border: 4px solid indianred;
  border-radius: 6px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;
`;

const removeFromList = (list, index) => {
  const result = [...list];
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = [...list];
  result.splice(index, 0, element);
  return result;
};

function PriorityView({ notes, setUpdateInstructions, priorities }) {
  const [items, setItems] = useState([]);
  const [assignedItems, setAssignedItems] = useState({});

  useEffect(() => {
    setItems(notes);
  }, [notes]);

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
    if (!result.destination) {
      return;
    }
    const listCopy = { ...assignedItems };

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );
    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    setAssignedItems(listCopy);

    setUpdateInstructions({
      shouldUpdate: true,
      shouldUpdateId: parseInt(result.draggableId),
      updatePrevId: parseInt(result.source.droppableId),
      updateNewId: parseInt(result.destination.droppableId),
    });
  };

  return (
    <DragDropContextContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <ListGrid>
          {priorities?.map((prirority) => (
            <DraggableElement
              label={prirority.name}
              elements={assignedItems[prirority.id]}
              key={`${prirority.id}`}
              prefix={`${prirority.id}`}
            />
          ))}
        </ListGrid>
      </DragDropContext>
    </DragDropContextContainer>
  );
}

export default PriorityView;
