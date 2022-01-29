import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";

import { getUserNotes } from "../../modules/NoteManager";
import NoteList from "./NoteList";
import NewNote from "./NewNote";

function DisplayNotes() {
  const [notes, setNotes] = useState([]);
  const [shouldUpdateNotes, setShouldUpdateNotes] = useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);

  const currentUser = 1;

  const getNotes = () => {
    getUserNotes(currentUser).then((res) => {
      setNotes(res);
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleUpdateNotes = (event) => {
    event.preventDefault();
    setShouldUpdateNotes(true).then(setShouldUpdateNotes(false));
  };

  const handleNewNote = () => {
    setIsDisplayingNewNote(true);
  };

  const handleNewNoteCancel = () => {
    setIsDisplayingNewNote(false);
  };

  return (
    <div className="notes-container">
      <NoteList notes={notes} shouldUpdateNotes={shouldUpdateNotes} />
      <NewNote
        isDisplaying={isDisplayingNewNote}
        shouldUpdateNotes={shouldUpdateNotes && isDisplayingNewNote}
      />
      <div className="notes-container--interaction">
        <button onClick={handleUpdateNotes}>Update</button>
        {isDisplayingNewNote ? (
          <button onClick={handleNewNoteCancel}>cancel</button>
        ) : (
          <button onClick={handleNewNote}>New Note</button>
        )}
      </div>
    </div>
  );
}

export default DisplayNotes;
