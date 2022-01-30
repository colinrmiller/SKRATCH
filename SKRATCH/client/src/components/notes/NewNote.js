import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./notes.css";
import { addNote } from "../../modules/NoteManager";
import { getUserTags, addTag, addNoteTag } from "../../modules/TagManager";
import { isContentNull, AddTagsToNoteObj } from "../../utils/utils";

function NewNote({ isDisplaying, shouldSubmit }) {
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
  // DONE

  // effect for submit note
  useEffect(() => {
    if (shouldSubmit && !isContentNull(note.content) && isDisplaying) {
      // if submiting
      getUserTags(currentUserId).then((existingUserTags) => {
        const noteWithTags = AddTagsToNoteObj(note, existingUserTags);
        const newTags = noteWithTags.tags.filter((tag) => tag.id === -1);

        const promisesToAddTags = newTags.map(
          (tag) =>
            new Promise((resolve, reject) => {
              const newTag = {
                name: tag.name,
                userId: note.userId,
                isUserCreated: true,
                metaData: "{}",
              };

              return addTag(newTag).then((tagId) => {
                newTag.id = tagId;
                return resolve(newTag);
              });
            })
        );
        debugger;

        Promise.all(promisesToAddTags).then((addedTags) => {
          const noteWithUpdatedTagIds = [];

          // update noteTags with just added tagIds
          noteWithTags.tags.forEach((tag, index) => {
            const tagIndex = addedTags
              .map((addedTag) => addedTag.name)
              .indexOf(tag.name);
            if (tagIndex === -1) noteWithUpdatedTagIds.push(tag);
            else {
              tag.id = addedTags[tagIndex].id;
              noteWithUpdatedTagIds.push(tag);
            }
          });

          if (note)
            addNote(noteWithTags).then((noteId) => {
              // add noteTags for note
              noteWithTags.tags.forEach((noteTag) => {
                debugger;
                const newNoteTag = { noteId: noteId, tagId: noteTag.id };
                addNoteTag(newNoteTag);
              });
            });
        });
      });
    }
  }, [shouldSubmit]);

  if (isDisplaying)
    return (
      <div className="notelist--item">
        <ListItem button dense>
          <textarea
            value={note.content}
            className="notelist--item__text"
            rows={textAreaRowCount}
            onChange={handleUpdateNoteContent}
          />
        </ListItem>
      </div>
    );
  else return <></>;
}

export default NewNote;
