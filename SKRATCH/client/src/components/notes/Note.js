import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import { isEqual, difference } from "lodash";
import "./notes.css";
import { updateNote, updateNoteTags } from "../../modules/NoteManager";
import { addNoteTag, removeNoteTag } from "../../modules/TagManager";
import { formatDate, cleanContent, isContentNull } from "../../utils/utils";
import useDebounce from "../../utils/useDebounce";
import { cloneDeep } from "lodash";
import { addNote } from "../../modules/NoteManager";
import { getUserTags, addTag } from "../../modules/TagManager";
import { AddTagsToNoteObj } from "../../utils/utils";
import { parseFilterOutTags } from "../../utils/parse";
import {
  AddTagsAndReturnCreatedIds,
  addNoteTagsForNote,
} from "../../utils/tags";

function NoteListItem({
  note,
  depthStep = 10,
  depth = 0,
  route,
  shouldUpdateNoteContent,
  setShouldUpdateNoteList,
  setShouldReloadNotes,
  index,
  lastItem,
}) {
  const history = useHistory();

  // Increase Textarea height based on content length
  const minTextAreaRowCount = 3;
  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  const [content, setContent] = useState(note.content);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isContentEmpty, setIsContentEmpty] = useState(false);
  const [areTagsUpdated, setAreTagsUpdated] = useState(false);

  const debouncedContent = useDebounce(content, 500);

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
        updateNoteTags(noteCopy);
      }
      if (isContentUpdated) {
        updateNote(noteCopy);
      }
      if (isContentNull(noteCopy.content)) {
        setShouldReloadNotes(true);
      }
    }
  }, [debouncedContent]);

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
