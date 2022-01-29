import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";
import { addNote } from "../../modules/NoteManager";
import { isContentNull } from "../../utils/utils";

function NewNote({ isDisplaying, shouldUpdateNotes }) {
  // Increase Textarea height based on content length
  const currentUserId = 1; // TODO

  const [note, setNote] = useState({ userId: currentUserId, content: "" });

  const handleContentChange = (event) => {
    let noteCopy = { ...note };
    noteCopy.content = event.target.value;
    setNote(noteCopy);
  };

  // update textarea rowlength
  const minTextAreaRowCount = 4;

  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  useEffect(() => {
    const textRowLen = note.content.split("\n");

    setTextAreaRowCount(Math.max(textRowLen.length, minTextAreaRowCount));
  }, [note.content]);
  //

  useEffect(() => {
    debugger;
    if (shouldUpdateNotes && !isContentNull(note.content)) {
      addNote(note);
    }
  }, [shouldUpdateNotes]);

  if (isDisplaying)
    return (
      <div className="notelist--item">
        <ListItem button dense>
          <textarea
            value={note.content}
            className="notelist--item__text"
            rows={textAreaRowCount}
            onChange={handleContentChange}
          />
        </ListItem>
      </div>
    );
  else return <></>;
}

export default NewNote;
