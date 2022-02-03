// remove any tags from note.content
export const parseFilterOutTags = (note) => {
  const copy = { ...note };
  copy.content = note.content.replace(/#\w+/g, "");
  return copy;
};
