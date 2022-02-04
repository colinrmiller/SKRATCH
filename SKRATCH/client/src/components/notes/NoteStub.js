import React from "react";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import "../notes/notes.css";
import { stubContent } from "../../utils/utils";

function NoteStub({ note }) {
  const history = useHistory();

  const handleRoute = () => {
    history.push(`/notes/${note.id}`);
  };

  return (
    <div className="noteList-item">
      <ListItem button dense onClick={handleRoute}>
        <div className="noteList__body--stub">
          <div className="noteList-stub--content" style={{ whiteSpace: "pre" }}>
            {stubContent(note.content)}
          </div>
          <div className="noteList-stub--tags">
            {note.tags.map((tag) => (
              <div>#{tag.name}</div>
            ))}
          </div>
        </div>
      </ListItem>
    </div>
  );
}

export default NoteStub;
