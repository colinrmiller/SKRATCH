import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../notes/notes.css";

import { getNotesByTagName } from "../../modules/NoteManager";
import NoteList from "../notes/NoteList";
import NewNote from "../notes/NewNote";

function TagDisplay() {
  const [notes, setNotes] = useState([]);
  const [shouldUpdateNotes, setShouldUpdateNotes] = useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);

  const currentUser = 1;

  const { tagName } = useParams();

  const getNotes = () => {
    getNotesByTagName(tagName, currentUser).then((res) => {
      setNotes(res);
    });
  };

  useEffect(() => {
    getNotes();
  }, []);

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

  return (
    <div className="notes-container">
      <NoteList notes={notes} shouldUpdateNotes={shouldUpdateNotes} />
      <NewNote
        isDisplaying={isDisplayingNewNote}
        shouldSubmit={shouldUpdateNotes}
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

export default TagDisplay;
