import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { isEqual, difference } from "lodash";
import "../notes/notes.css";
import { updateNote } from "../../modules/NoteManager";
import { addNoteTag, removeNoteTag } from "../../modules/TagManager";
import { formatDate } from "../../utils/utils";

function AgendaItem({
  note,
  depthStep = 10,
  depth = 0,
  route,
  shouldUpdateNoteContent,
}) {
  const history = useHistory();

  // Increase Textarea height based on content length
  const minTextAreaRowCount = 4;
  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  const [content, setContent] = useState(note.content);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [areTagsUpdated, setAreTagsUpdated] = useState(false);

  const handleContentChange = (event) => {
    setIsContentUpdated(true);
    setContent(event.target.value);
  };

  const updateNoteTags = (noteCopy) => {
    const tagsToRemove = difference(
      noteCopy.tags.map((tag) => tag.id),
      noteCopy.activeTagIds
    );
    const tagsToAdd = difference(
      noteCopy.activeTagIds,
      noteCopy.tags.map((tag) => tag.id)
    );

    // foreach updatedTagId POST
    tagsToAdd.forEach((tagId) => {
      const newNoteTag = {
        tagId: tagId,
        noteId: noteCopy.id,
      };
      addNoteTag(newNoteTag);
    });
    tagsToRemove.forEach((tagId) => {
      const newNoteTag = {
        tagId: tagId,
        noteId: noteCopy.id,
      };
      removeNoteTag(newNoteTag);
    });
  };

  useEffect(() => {
    const rowlen = typeof content == "string" ? content.split("\n") : 0;

    setTextAreaRowCount(Math.max(rowlen.length, minTextAreaRowCount));
  }, [content]);

  useEffect(() => {
    // set isContentUpdated if there is a change in active tags
    if (
      !isEqual(
        note.tags.map((tag) => tag.id),
        note.activeTagIds
      )
    ) {
      setAreTagsUpdated(true);
    }
  }, [note]);

  useEffect(() => {
    if (shouldUpdateNoteContent && (isContentUpdated || areTagsUpdated)) {
      let noteCopy = { ...note };
      noteCopy.content = content;

      if (areTagsUpdated) {
        updateNoteTags(noteCopy);
      }
      if (isContentUpdated) {
        updateNote(noteCopy);
      }
    }
  }, [shouldUpdateNoteContent]);

  return (
    <div className="noteList-item">
      <ListItem button dense>
        <div className="noteList__body">
          <div className="noteList-item--header">
            <div className="noteList-item--updated">
              last updated: {formatDate(note.dateUpdated)}{" "}
            </div>
            <div className="noteList-item--route">Details</div>
          </div>
          <textarea
            value={content}
            className="noteList-item--text"
            rows={textAreaRowCount}
            onChange={handleContentChange}
          />
        </div>
      </ListItem>
    </div>
  );
}

export default AgendaItem;
