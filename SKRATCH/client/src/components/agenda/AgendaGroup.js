import React from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../notes/notes.css";
import AgendaItem from "./AgendaItem";
import NoteStub from "../notes/NoteStub";

function AgendaGroup({ notes, depthStep, depth, shouldUpdateNotes }) {
  return (
    <div className="notelist">
      <List disablePadding dense>
        {notes.map((note, index) => (
          <NoteStub
            key={`${note.id}`}
            note={note}
            depthStep={depthStep}
            depth={depth}
            route={note.route}
            shouldUpdateNoteContent={shouldUpdateNotes}
            {...note}
          />
        ))}
      </List>
    </div>
  );
}
export default AgendaGroup;
