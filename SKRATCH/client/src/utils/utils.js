export const isContentNull = (content) => {
  return content.trim() === "";
};

export const ParseNoteTags = (noteContent) => {
  const regex = /(?:#)\w*(?=[\s\\])/g;
  const matches = [...noteContent.matchAll(regex)];

  const tags = matches.map((match) => match[0].slice(1));

  return tags;
};

export const AddTagsToNoteObj = (note, existingUserTags) => {
  const noteCopy = { ...note };
  noteCopy.content = noteCopy.content += "\n";

  const noteTags = ParseNoteTags(noteCopy.content);

  noteCopy.tags = noteTags.map((tag) => {
    const existingTag = existingUserTags.filter((t) => {
      return t.name.toLowerCase() === tag.toLowerCase();
    });

    return { name: tag, id: existingTag.length > 0 ? existingTag[0].id : -1 };
  });

  return noteCopy;
};
