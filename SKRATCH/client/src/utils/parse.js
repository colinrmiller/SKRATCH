import { cloneDeep } from "lodash";

// remove any tags from note.content
export const parseFilterOutTagsFromNoteContent = (note) => {
  const clone = cloneDeep(note);
  clone.content = note.content.replace(/\*\*#\w+/g, "");
  clone.content = note.content.replace(/#\w+/g, "");
  return clone;
};

export const parseFilterOutDatesFromNoteContent = (note) => {
  const clone = cloneDeep(note);
  clone.content = note.content.replace(/\/\d{2}-\d{2}--\d{2}-\d{2}/g, "");
  clone.content = note.content.replace(/\/\d{2}-\d{2}/g, "");
  return clone;
};

export const cleanNoteContent = (note) => {
  let clone = cloneDeep(note);
  clone = parseFilterOutDatesFromNoteContent(clone);
  clone = parseFilterOutTagsFromNoteContent(clone);
  clone.content = clone.content.trim();
  return clone;
};
