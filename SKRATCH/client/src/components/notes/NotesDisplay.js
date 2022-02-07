import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
import { cloneDeep } from "lodash";
import "./notes.css";

import { getUserNotes } from "../../modules/NoteManager";
import NoteList from "./NoteList";
// import NewNote from "./NewNote";

function NotesDisplay() {
  const [notes, setNotes] = useState([]);
  const [shouldupdateOrDeleteNotes, setShouldupdateOrDeleteNotes] =
    useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);
  const [isNewNoteSubmitted, setIsNewNoteSubmitted] = useState(false);
  const [shouldReloadNotes, setShouldReloadNotes] = useState(false);
  // const [shouldPushNewNote, setShouldPushNewNote] = useState(false);
  const currentUserId = 1;

  const pushNewNote = () => {
    const notesClone = cloneDeep(notes);
    const emptyNote = {
      id: -1,
      content: "",
      dateAdded: null,
      dateUpdated: null,
      userId: currentUserId,
      user: null,
      isStaged: false,
      metaData: null,
      tags: [],
      dateStart: null,
      dateEnd: null,
      activeTagIds: [],
    };
    notesClone.push(emptyNote);
    return notesClone;
  };

  const getNotes = () => {
    const AddActiveTagIdsToNote = (note) => {
      const activeTagIds = note.tags.map((tag) => tag.id);
      note.activeTagIds = activeTagIds;
      return note;
    };

    getUserNotes(currentUserId).then((res) => {
      const notesWithActiveTagIds = res.map((note) =>
        AddActiveTagIdsToNote(note)
      );

      setNotes(notesWithActiveTagIds);
    });
  };

  const setNoteByIndex = (index, note) => {
    let notesClone = cloneDeep(notes);
    notesClone[index] = note;
    setNotes(notesClone);
  };

  useEffect(() => {
    getNotes();
    setIsNewNoteSubmitted(false);
  }, [isNewNoteSubmitted, shouldReloadNotes]);

  const handleupdateOrDeleteNotes = (event) => {
    event.preventDefault();
    setShouldupdateOrDeleteNotes((value) => !value);
  };

  const handleNewNote = () => {
    setIsDisplayingNewNote(true);
  };

  const handleNewNoteCancel = () => {
    setIsDisplayingNewNote(false);
  };

  useEffect(() => {
    if (notes[notes.length - 1]?.id !== -1) {
      let notesCopy = cloneDeep(notes);
      notesCopy = pushNewNote(notesCopy);
      setNotes(notesCopy);
    }
  }, [notes]);

  useEffect(() => {});

  return (
    <div className="notes-container">
      <NoteList
        notes={notes}
        shouldupdateOrDeleteNotes={shouldupdateOrDeleteNotes}
        setShouldReloadNotes={setShouldReloadNotes}
        setNoteByIndex={setNoteByIndex}
      />
      {/* <NewNote
        isDisplaying={true}
        shouldSubmit={shouldupdateOrDeleteNotes}
        setIsNewNoteSubmitted={setIsNewNoteSubmitted}
        // noteIndex={notes.length}
      /> */}
      <div className="notes-container--interaction">
        <button onClick={handleupdateOrDeleteNotes}>Update</button>
        {isDisplayingNewNote ? (
          <button onClick={handleNewNoteCancel}>Cancel</button>
        ) : (
          <button onClick={handleNewNote}>New Note</button>
        )}
      </div>
    </div>
  );
}

export default NotesDisplay;
