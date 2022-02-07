import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../notes/notes.css";
import { cloneDeep } from "lodash";

import {
  getUserNotes,
  getUpcomingUserNotes,
  updateNote,
  updateExistingNoteTags,
} from "../../modules/NoteManager";
import { getPriorities } from "../../modules/TagManager";

import AgendaGroup from "./AgendaGroup";
import NoteList from "../notes/NoteList";
import NewNote from "../notes/NewNote";
import PriorityView from "../priority/PriorityView.js";
import DateView from "./DateView";
import { update } from "lodash";

function Agenda() {
  const [notes, setNotes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [updateInstructions, setUpdateInstructions] = useState({
    shouldUpdate: 0,
    shouldUpdateId: 0,
    updatePrevId: 0,
    updateNewId: 0,
  });

  const currentUser = 1;

  const getNotes = () => {
    getUpcomingUserNotes(currentUser).then((resNotes) => {
      setNotes(resNotes);
    });
  };

  const updateNoteWithInstructions = (noteId, prevId, newId) => {
    const notesCopy = cloneDeep(notes);
    const noteIndex = notesCopy.findIndex((note) => {
      return note.id == noteId;
    });
    const tagIndex = notesCopy[noteIndex].tags.findIndex(
      (tag) => tag.id === prevId
    );
    const newTagIndex = priorities.findIndex(
      (priority) => priority.id === newId
    );
    notesCopy[noteIndex].tags.splice(tagIndex, 1, priorities[newTagIndex]);
    return notesCopy;
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    getPriorities().then((res) => {
      setPriorities(res);
    });
  }, []);

  useEffect(() => {
    if (updateInstructions.shouldUpdate) {
      const noteToUpdate = notes.find(
        (note) => note.id === updateInstructions.shouldUpdateId
      );
      const currentTags = noteToUpdate.tags.map((tag) => tag.id);
      const oldTagIndex = currentTags.indexOf(updateInstructions.updatePrevId);
      currentTags.splice(oldTagIndex, 1, updateInstructions.updateNewId);
      noteToUpdate.activeTagIds = currentTags;

      const updatedNotes = updateNoteWithInstructions(
        updateInstructions.shouldUpdateId,
        updateInstructions.updatePrevId,
        updateInstructions.updateNewId
      );

      setNotes(updatedNotes);

      // updateNote(noteToUpdate);
      updateExistingNoteTags(noteToUpdate);
    }
  }, [updateInstructions]);

  useEffect(() => {});

  return (
    <div className="agenda">
      <PriorityView
        notes={notes}
        setUpdateInstructions={setUpdateInstructions}
        priorities={priorities}
      />
      <DateView notes={notes} />
    </div>
  );
}

export default Agenda;
