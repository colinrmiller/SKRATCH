import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import { isEqual, difference } from "lodash";
import "./notes.css";
import {
  updateOrDeleteNote,
  updateExistingNoteTags,
} from "../../modules/NoteManager";
import { addNoteTag, removeNoteTag } from "../../modules/TagManager";
import { formatDate, cleanContent, isContentNull } from "../../utils/utils";
import useDebounce from "../../utils/useDebounce";
import { cloneDeep } from "lodash";
import { addNote } from "../../modules/NoteManager";
import { getUserTags, addTag } from "../../modules/TagManager";
import { injectTagsIntoNote } from "../../utils/utils";
import { parseFilterOutTagsFromNoteContent } from "../../utils/parse";
import {
  postNewTagsAndReturnCreatedIds,
  injectNewlyAddedTagsIntoNote,
} from "../../utils/tags";

function NoteListItem({
  note,
  depthStep = 10,
  depth = 0,
  route,
  shouldupdateOrDeleteNoteContent,
  setShouldupdateOrDeleteNoteList,
  setShouldReloadNotes,
  setIsNewNoteSubmitted,
  index,
  lastItem,
}) {
  const history = useHistory();

  // Increase Textarea height based on content length
  const minTextAreaRowCount = 3;
  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  const currentUserId = 1;

  const [content, setContent] = useState(note.content);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(false);
  const [areTagsUpdated, setAreTagsUpdated] = useState(false);
  const [localNote, setLocalNote] = useState(cloneDeep(note));

  const debouncedContent = useDebounce(content, 500);
  const debouncedNote = useDebounce(localNote, 500);

  const handleContentChange = (event) => {
    setIsContentUpdated(true);
    setContent(event.target.value);
  };

  const handleClick = () => {
    history.push(`/notes/${note.id}`);
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
    if (isContentUpdated || areTagsUpdated) {
      let noteCopy = cloneDeep(note);
      noteCopy.content = content;

      if (areTagsUpdated) {
        updateExistingNoteTags(noteCopy);
      }
      if (isContentUpdated) {
        updateOrDeleteNote(noteCopy);
      }
      if (isContentNull(noteCopy.content)) {
        setShouldReloadNotes(true);
      }
    }
  }, [debouncedContent]);

  const clearNote = () => {
    setLocalNote({ userId: currentUserId, content: "" });
  };

  // submit note on shouldSubmit=true
  useEffect(() => {
    if (!isContentNull(note.content)) {
      // if submiting
      getUserTags(currentUserId)
        .then((existingUserTags) => {
          const noteCopy = injectTagsIntoNote(note, existingUserTags);
          const newTags = noteCopy.tags.filter((tag) => tag.id === -1);

          const promisesToAddTags = postNewTagsAndReturnCreatedIds(
            newTags,
            noteCopy
          );

          return Promise.all(promisesToAddTags).then((addedTags) => {
            injectNewlyAddedTagsIntoNote(addedTags, noteCopy);
          });
        })
        .then(() => {
          clearNote();
          setIsNewNoteSubmitted(true);
        });
    }
  }, [debouncedNote]);

  useEffect(() => {
    const input = document.getElementById(`noteList-item--${index}`);
    input.setAttribute("autofocus", "");
  }, []);

  return (
    <div className="noteList-item">
      <ListItem button dense tabIndex={-1}>
        <div className="noteList__body">
          <div className="noteList-item--header" onClick={handleClick}>
            <div className="noteList-item--updated">
              Last Updated: {formatDate(note.dateUpdated)}
            </div>
          </div>
          <textarea
            value={cleanContent(content)}
            className="noteList-item--text"
            id={`noteList-item--${index}`}
            rows={textAreaRowCount}
            onChange={handleContentChange}

            // tabIndex={index}
          />
        </div>
      </ListItem>
    </div>
  );
}

export default NoteListItem;
