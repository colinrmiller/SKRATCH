import React from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";
import NoteListItem from "./NoteListItem";

function NoteList({
  notes,
  depthStep,
  depth,
  shouldUpdateNotes,
  setShouldReloadNotes,
}) {
  return (
    <div className="notelist">
      <List disablePadding dense>
        {notes?.map((note, index) => (
          <NoteListItem
            key={`${note.id}`}
            note={note}
            depthStep={depthStep}
            depth={depth}
            route={note.route}
            shouldUpdateNoteContent={shouldUpdateNotes}
            setShouldReloadNotes={setShouldReloadNotes}
            index={index}
            lastItem={index === notes.length - 1}
            {...note}
          />
        ))}
      </List>
    </div>
  );
}
export default NoteList;
