import { addTag, addNoteTag } from "../modules/TagManager";
import { addNote } from "../modules/NoteManager";
import { parseFilterOutTags } from "./parse";

export const AddTagsAndReturnCreatedIds = (newTagList, note) => {
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

export const addNoteTagsForNote = (addedTags, newNote) => {
  const noteWithUpdatedTagIds = [];

  // update note.tags with Ids for ones just created
  newNote.tags.forEach((tag) => {
    const tagIndex = addedTags
      .map((addedTag) => addedTag.name)
      .indexOf(tag.name);
    if (tagIndex === -1) noteWithUpdatedTagIds.push(tag);
    else {
      tag.id = addedTags[tagIndex].id;
      noteWithUpdatedTagIds.push(tag);
    }
  });

  newNote = parseFilterOutTags(newNote);

  if (newNote)
    return addNote(newNote).then((noteId) => {
      // POST noteTags for note
      newNote.tags.forEach((noteTag) => {
        const newNoteTag = { noteId: noteId, tagId: noteTag.id };
        addNoteTag(newNoteTag);
      });
    });
};
