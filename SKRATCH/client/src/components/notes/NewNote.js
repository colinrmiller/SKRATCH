import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { cloneDeep } from "lodash";
import "./notes.css";
import { addNote } from "../../modules/NoteManager";
import { getUserTags, addTag, addNoteTag } from "../../modules/TagManager";
import { isContentNull, AddTagsToNoteObj } from "../../utils/utils";
import { parseFilterOutTags } from "../../utils/parse";
import {
  AddTagsAndReturnCreatedIds,
  addNoteTagsForNote,
} from "../../utils/tags";

function NewNote({ isDisplaying, shouldSubmit, setIsNewNoteSubmitted }) {
  const currentUserId = 1; // TODO

  const [note, setNote] = useState({ userId: currentUserId, content: "" });

  const handleUpdateNoteContent = (event) => {
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

  const clearNote = () => {
    setNote({ userId: currentUserId, content: "" });
  };

  // submit note on shouldSubmit=true
  useEffect(() => {
    if (shouldSubmit && !isContentNull(note.content) && isDisplaying) {
      // if submiting
      getUserTags(currentUserId)
        .then((existingUserTags) => {
          const noteCopy = AddTagsToNoteObj(note, existingUserTags);
          const newTags = noteCopy.tags.filter((tag) => tag.id === -1);

          const promisesToAddTags = AddTagsAndReturnCreatedIds(
            newTags,
            noteCopy
          );

          return Promise.all(promisesToAddTags).then((addedTags) => {
            addNoteTagsForNote(addedTags, noteCopy);
          });
        })
        .then(() => {
          clearNote();
          setIsNewNoteSubmitted(true);
        });
    }
  }, [shouldSubmit]);

  if (isDisplaying)
    return (
      <div className="noteList-item">
        <ListItem button dense>
          <textarea
            value={note.content}
            className="noteList-item--text"
            rows={textAreaRowCount}
            onChange={handleUpdateNoteContent}
          />
        </ListItem>
      </div>
    );
  else return <></>;
}

export default NewNote;
