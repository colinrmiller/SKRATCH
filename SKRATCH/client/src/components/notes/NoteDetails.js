import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";

import { getNoteById } from "../../modules/NoteManager";
import NoteList from "./NoteList";
import TagView from "../tags/TagView";
import TagSelectDropdown from "../tags/TagSelectDropdown";
import DateSelect from "../tags/DateSelect";

function NoteDetails() {
  const { id } = useParams();

  const [note, setNote] = useState([]);
  const [shouldUpdateNote, setShouldUpdateNote] = useState(false);
  const [activeTagIds, setActiveTags] = useState(false);

  const getNote = () => {
    getNoteById(id).then((res) => {
      const resNote = { ...res };
      resNote.activeTagIds = resNote.tags.map((tag) => tag.id);

      setNote([resNote]);
      setActiveTags(res.tags.map((tag) => tag.id));
    });
  };

  useEffect(() => {
    getNote();
  }, []);

  // TODO Fix only working on every other submit
  const handleUpdateNote = (event) => {
    event.preventDefault();
    setShouldUpdateNote((value) => !value);
  };

  return (
    <div className="note-details-container">
      <div className="notes-container--interaction">
        <button onClick={handleUpdateNote}>Update</button>
      </div>
      <NoteList notes={note} shouldUpdateNotes={shouldUpdateNote} />
      <div className="note-details__aside">
        {note.length > 0 ? <TagView note={note[0]} setNote={setNote} /> : null}
        {note.length > 0 ? (
          <TagSelectDropdown
            note={note[0]}
            setNote={setNote}
            tagType="priority"
          />
        ) : null}
        {note.length > 0 ? (
          <DateSelect note={note[0]} setNote={setNote} />
        ) : null}
      </div>
    </div>
  );
}

export default NoteDetails;
