import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";
import { updateNote } from "../../modules/NoteManager";

function NoteListItem({
  label,
  note,
  items,
  depthStep = 10,
  depth = 0,
  route,
  shouldUpdateNoteContent,
  ...rest
}) {
  const history = useHistory();

  const handleNav = (route) => {
    history.push(route);
  };

  // Increase Textarea height based on content length
  const minTextAreaRowCount = 4;

  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);
  const [content, setContent] = useState(note.content);
  const [isContentUpdated, setIsContentUpdated] = useState(false);

  const handleContentChange = (event) => {
    setIsContentUpdated(true);
    setContent(event.target.value);
  };

  useEffect(() => {
    const rowlen = content.split("\n");

    setTextAreaRowCount(Math.max(rowlen.length, minTextAreaRowCount));
  }, [content]);

  useEffect(() => {
    if (shouldUpdateNoteContent && isContentUpdated) {
      let noteCopy = { ...note };
      noteCopy.content = content;
      updateNote(noteCopy);
    }
  }, [shouldUpdateNoteContent]);

  return (
    <div className="notelist--item">
      <ListItem button dense {...rest}>
        <textarea
          value={content}
          className="notelist--item__text"
          rows={textAreaRowCount}
          onChange={handleContentChange}
        />
      </ListItem>
    </div>
  );
}

export default NoteListItem;
