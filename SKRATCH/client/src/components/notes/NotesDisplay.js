import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";

import { getUserNotes } from "../../modules/NoteManager";
import NoteList from "./NoteList";
import NewNote from "./NewNote";

function NotesDisplay() {
  const [notes, setNotes] = useState([]);
  const [shouldUpdateNotes, setShouldUpdateNotes] = useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);
  const [isNewNoteSubmitted, setIsNewNoteSubmitted] = useState(false);

  const currentUser = 1;

  const getNotes = () => {
    const AddActiveTagIdsToNote = (note) => {
      const activeTagIds = note.tags.map((tag) => tag.id);
      note.activeTagIds = activeTagIds;
      return note;
    };
    getUserNotes(currentUser).then((res) => {
      const notesWithActiveTagIds = res.map((note) =>
        AddActiveTagIdsToNote(note)
      );
      setNotes(notesWithActiveTagIds);
    });
  };

  useEffect(() => {
    getNotes();
  }, [isNewNoteSubmitted]);

  const handleUpdateNotes = (event) => {
    event.preventDefault();
    setShouldUpdateNotes((value) => !value);
  };

  const handleNewNote = () => {
    setIsDisplayingNewNote(true);
  };

  const handleNewNoteCancel = () => {
    setIsDisplayingNewNote(false);
  };

  useEffect(() => {});

  return (
    <div className="notes-container">
      <NoteList notes={notes} shouldUpdateNotes={shouldUpdateNotes} />
      <NewNote
        isDisplaying={isDisplayingNewNote}
        shouldSubmit={shouldUpdateNotes}
        setIsNewNoteSubmitted={setIsNewNoteSubmitted}
      />
      <div className="notes-container--interaction">
        <button onClick={handleUpdateNotes}>Update</button>
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
