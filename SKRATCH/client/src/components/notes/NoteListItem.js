import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import { isEqual, difference } from "lodash";
import ReactMarkdown from "react-markdown";
import Toggle from "react-toggle";
import CodeBlock from "../../utils/codeBlock";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import "./notes.css";
import {
  addNote,
  updateOrDeleteNote,
  updateExistingNoteTags,
} from "../../modules/NoteManager";
import {
  addNoteTag,
  removeNoteTag,
  getUserTags,
} from "../../modules/TagManager";
import {
  formatDate,
  cleanContent,
  isContentNull,
  injectTagsIntoNote,
} from "../../utils/utils";
import { cleanNoteContent } from "../../utils/parse";
import { postNewTagsAndReturnCreatedIds } from "../../utils/tags";
import useDebounce from "../../utils/useDebounce";
import { cloneDeep } from "lodash";

function NoteListItem({
  note: noteParam,
  setNoteByIndex,
  depthStep = 10,
  depth = 0,
  route,
  setShouldReloadNotes,
  index,
  lastItem,
}) {
  const history = useHistory();

  const currentUserId = 1; // TODO

  // Increase Textarea height based on content length
  const minTextAreaRowCount = 3;
  const [textAreaRowCount, setTextAreaRowCount] = useState(minTextAreaRowCount);

  const [note, setNote] = useState(noteParam);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isTagsUpdated, setIsTagsUpdated] = useState(false);
  const [isNewNote, setIsNewNote] = useState(note.id === -1);
  const [viewMd, setViewMd] = useState(true);

  const debouncedNote = useDebounce(note, 500);

  const handleUpdateContent = (event) => {
    setIsContentUpdated(true);
    const noteCopy = cloneDeep(note);
    noteCopy.content = event.target.value;
    setNote(noteCopy);
  };

  const handleClick = () => {
    history.push(`/notes/${note.id}`);
  };

  const setNoteId = (noteId) => {
    let noteCopy = cloneDeep(note);
    noteCopy.id = noteId;
    setNote(noteCopy);
  };

  useEffect(() => {
    const rowlen =
      typeof note.content == "string" ? note.content.split("\n") : 0;
    setTextAreaRowCount(Math.max(rowlen.length, minTextAreaRowCount));
  }, [note]);

  useEffect(() => {
    setNote(noteParam);
  }, [noteParam]);

  useEffect(() => {
    // set isContentUpdated if there is a change in active tags
    if (
      !isEqual(
        note.tags.map((tag) => tag.id),
        note.activeTagIds
      )
    ) {
      setIsTagsUpdated(true);
    }
  }, [note]);

  const findNoteContentTags = (localNote) => {
    return getUserTags(currentUserId).then((existingUserTags) => {
      return injectTagsIntoNote(localNote, existingUserTags);
    });
  };

  const updateMissingTagIdsWithNewTags = (localNote, addedTags) => {
    let noteCopy = cloneDeep(localNote);
    if (addedTags.length > 0) {
      addedTags.forEach((newTag) => {
        let updatingTag = noteCopy.tags.find((tag) => {
          return tag.name === newTag.name;
        });
        updatingTag.id = newTag.id;
      });
    }
    return noteCopy;
  };
  const postNewTagsAndUpdateIds = (localNote) => {
    const newTags = localNote.tags.filter((tag) => tag.id === -1);

    const promisesToAddTags = postNewTagsAndReturnCreatedIds(
      newTags,
      localNote
    );

    return Promise.all(promisesToAddTags).then((addedTags) => {
      let preparedNote = updateMissingTagIdsWithNewTags(localNote, addedTags);
      preparedNote.activeTagIds = preparedNote.tags.map((tag) => tag.id);
      preparedNote.tags = preparedNote.tags.filter(
        (tag) => {
          let addingTagIds = addedTags.map((addingTag) => addingTag.id);
          return addingTagIds.indexOf(tag.id) === -1;
        }
        // addedTags.map((addingTag) => addingTag.id).indexOf(tag.id) !== -1
      );
      return preparedNote;
    });
  };

  useEffect(() => {
    if (note.id === -1 && isContentUpdated) {
      addNote(note).then((noteId) => {
        let cloneNote = cloneDeep(note);
        cloneNote.id = noteId;
        setNoteId(noteId);
        setIsNewNote(false);
        setIsContentUpdated(false);

        setNoteByIndex(index, cloneNote);
      });
    } else if (isContentUpdated || isTagsUpdated) {
      if (isTagsUpdated) {
        updateExistingNoteTags(note);
      }
      if (isContentUpdated) {
        findNoteContentTags(note).then((resNote) => {
          let cleanedNote = cleanNoteContent(resNote);

          postNewTagsAndUpdateIds(cleanedNote).then((res) => {
            updateExistingNoteTags(res);
          });
          updateOrDeleteNote(cleanedNote);
        });
      }
      if (isContentNull(note.content)) {
        // reload list to remove deleted Notes
        setShouldReloadNotes(true);
      }
    }
  }, [debouncedNote]);

  useEffect(() => {
    const input = document.getElementById(`noteList-item--${index}`);
    input.setAttribute("autofocus", "");
  }, []);

  const handleBlur = useCallback(() => {
    setViewMd(true);
  }, []);

  return (
    <div className="noteList-item" style={{ textAlign: "left" }}>
      <ListItem button dense tabIndex={-1}>
        <div
          className="noteList__body"
          style={{ display: viewMd && !isNewNote ? "none" : "block" }}
        >
          <div className="noteList-item--header" onClick={handleClick}>
            <div className="noteList-item--updated">
              Last Updated: {formatDate(note.dateUpdated)}
            </div>
          </div>
          <textarea
            value={cleanContent(note.content)}
            className="noteList-item--text"
            id={`noteList-item--${index}`}
            rows={textAreaRowCount}
            onChange={handleUpdateContent}
            onBlur={handleBlur}
          />
        </div>
        <div
          onClick={() => {
            setViewMd(false);
          }}
        >
          {viewMd ? (
            <ReactMarkdown
              children={note.content}
              display={viewMd ? "flex" : "hidden"}
              className="markdown"
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children)?.replace(/\n$/, "")}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : null;
                  // <code className={className} {...props}>
                  //   {children}
                  // </code>
                },
              }}
            />
          ) : null}
        </div>
      </ListItem>
    </div>
  );
}

export default NoteListItem;
