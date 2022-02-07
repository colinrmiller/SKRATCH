import React, { useEffect, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import { cloneDeep } from "lodash";
import "./notes.css";
import { addNote } from "../../modules/NoteManager";
import { getUserTags, addTag, addNoteTag } from "../../modules/TagManager";
import { isContentNull, injectTagsIntoNote } from "../../utils/utils";
import { cleanNoteContent } from "../../utils/parse";
import {
  postNewTagsAndReturnCreatedIds,
  injectNewlyAddedTagsIntoNote,
} from "../../utils/tags";
import useDebounce from "../../utils/useDebounce";

const currentUserId = 1; // TODO

function NewNote({ setIsNewNoteSubmitted }) {
  const [note, setNote] = useState({ userId: currentUserId, content: "" });

  const debouncedNote = useDebounce(note, 500);

  const handleupdateOrDeleteNoteContent = (event) => {
    let noteClone = cloneDeep(note);
    noteClone.content = event.target.value;
    setNote(noteClone);
  };

  const clearNote = () => {
    setNote({ userId: currentUserId, content: "" });
  };

  const createNoteTag = (noteId, noteTag) => {
    const preparedNoteTag = { noteId: noteId, tagId: noteTag.id };
    addNoteTag(preparedNoteTag);
  };

  const createEachNoteTag = (preparedNote, noteId) => {
    // POST noteTags for note
    preparedNote.tags.forEach((tag) => createNoteTag(tag).bind(this, noteId));
  };

  const prepareNote = (addedTags, noteCopy) => {
    let preparedNote = injectNewlyAddedTagsIntoNote(addedTags, noteCopy);
    preparedNote = cleanNoteContent(preparedNote);
    return preparedNote;
  };

  // postTag().then(postNote().then(postNoteTag()))
  const submitNoteAndTags = (note) => {
    getUserTags(currentUserId)
      .then((existingUserTags) => {
        const noteCopy = injectTagsIntoNote(note, existingUserTags);
        const newTags = noteCopy.tags.filter((tag) => tag.id === -1);

        const promisesToAddTags = postNewTagsAndReturnCreatedIds(
          newTags,
          noteCopy
        );

        return Promise.all(promisesToAddTags).then((addedTags) => {
          const preparedNote = prepareNote(addedTags, noteCopy);

          return addNote(preparedNote).then(
            createEachNoteTag.bind(preparedNote)
          );
        });
      })
      .then(() => {
        clearNote();
        setIsNewNoteSubmitted(true);
      });
  };

  // update textarea rowlength
  const minTextAreaRowCount = 4;

  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  useEffect(() => {
    const textRowLen = note.content.split("\n");

    setTextAreaRowCount(Math.max(textRowLen.length, minTextAreaRowCount));
  }, [note.content]);

  // submit note on shouldSubmit=true
  useEffect(() => {
    if (!isContentNull(note.content)) {
      // if submiting

      submitNoteAndTags(note);
    }
  }, [debouncedNote]);

  return (
    <div className="noteList-item">
      <ListItem button dense tabIndex={-1}>
        <textarea
          value={note.content}
          className="noteList-item--text"
          rows={textAreaRowCount}
          onChange={handleupdateOrDeleteNoteContent}
        />
      </ListItem>
    </div>
  );
}

export default NewNote;
