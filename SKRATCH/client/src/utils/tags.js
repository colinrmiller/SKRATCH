import { addTag, addNoteTag } from "../modules/TagManager";
import { addNote } from "../modules/NoteManager";
import { parseFilterOutTagsFromNoteContent } from "./parse";
import { cloneDeep } from "lodash";

export const postNewTagsAndReturnCreatedIds = (newTagList, note) => {
  return newTagList.map(
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
};

// export const updateMissingTagIdsWithNewTags = (note, newTags);

export const injectNewlyAddedTagsIntoNote = (addedTags, newNote) => {
  const updatedTags = [];

  let noteClone = cloneDeep(newNote);

  // update note.tags with Ids for ones just created
  noteClone.tags.forEach((tag) => {
    const tagIndex = addedTags
      .map((addedTag) => addedTag.name)
      .indexOf(tag.name);
    if (tagIndex === -1) updatedTags.push(tag);
    else {
      tag.id = addedTags[tagIndex].id;
      updatedTags.push(tag);
    }
  });

  noteClone.tags = updatedTags;
  // newNote = parseFilterOutTagsFromNoteContent(newNote);

  return noteClone;

  // if (newNote)
  //   return addNote(newNote).then((noteId) => {
  //     // POST noteTags for note
  //     newNote.tags.forEach((noteTag) => {
  //       const newNoteTag = { noteId: noteId, tagId: noteTag.id };
  //       addNoteTag(newNoteTag);
  //     });
  //   });
};
