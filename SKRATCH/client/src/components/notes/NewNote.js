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
import useDebounce from "../../utils/useDebounce";

function NewNote({ setIsNewNoteSubmitted }) {
  const currentUserId = 1; // TODO

  const [note, setNote] = useState({ userId: currentUserId, content: "" });

  const debouncedNote = useDebounce(note, 500);

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
    if (!isContentNull(note.content)) {
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
  }, [debouncedNote]);

  return (
    <div className="noteList-item">
      <ListItem button dense tabIndex={-1}>
        <textarea
          value={note.content}
          className="noteList-item--text"
          rows={textAreaRowCount}
          onChange={handleUpdateNoteContent}
        />
      </ListItem>
    </div>
  );
}

export default NewNote;
