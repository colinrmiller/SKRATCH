import { cloneDeep } from "lodash";

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
  const noteCopy = cloneDeep(note);
  noteCopy.content = noteCopy.content += "\n";

  const noteTags = ParseNoteTags(noteCopy.content);

  noteCopy.tags = noteTags.map((tag) => {
    const existingTag = existingUserTags.filter((t) => {
      return t.name.toLowerCase() === tag.toLowerCase();
    });

    return {
      name: tag,
      id: existingTag.length > 0 ? existingTag[0].id : -1,
    };
  });

  return noteCopy;
};

export const formatDate = (dateTime) => {
  var year = dateTime.split("-")[0];
  var month = dateTime.split("-")[1];
  var day = dateTime.split("-")[2].slice(0, 2);

  const nth = function (d) {
    if (d > 3 && d < 21) return "th";

    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  var date = new Date(year, month, day);

  const ye = new Intl.DateTimeFormat("en", {
    year: "numeric",
  }).format(date);

  const mo = new Intl.DateTimeFormat("en", {
    month: "short",
  }).format(date);

  const da = new Intl.DateTimeFormat("en", {
    day: "numeric",
  }).format(date);

  return `${mo} ${da}${nth(da)} ${ye}  `;
};

export const stubContent = (content) => {
  const STUB_VIEW_CONTENT_LENGTH = 60;
  const cleanContent = content.replace(/\\n/g, "\n");
  const cleanContentFirstLine = cleanContent.split("\n")[0];

  if (cleanContentFirstLine.length > STUB_VIEW_CONTENT_LENGTH) {
    return `${cleanContentFirstLine.slice(0, STUB_VIEW_CONTENT_LENGTH)}...`;
  } else return cleanContentFirstLine.replace(/\\\\/g, "\\");
};

export const cleanContent = (content) => {
  const cleanContent = content.replace(/\\n/g, "\n");
  return cleanContent;
};

export const cleanPriorityCard = (content) => {
  const STUB_VIEW_CONTENT_LENGTH = 60;
  const stubLine = (line) => {
    if (line.length < STUB_VIEW_CONTENT_LENGTH) return [line];
    else {
      const head = line.slice(0, STUB_VIEW_CONTENT_LENGTH);
      const tail = line.slice(0, STUB_VIEW_CONTENT_LENGTH);
      return [head, ...stubLine(tail)];
    }
  };

  const cleanContent = content.replace(/\\n/g, "\n");
  const cleanContentLines = cleanContent.split("\n");
  const cleanContentStub = cleanContentLines.reduce((acc, line) => {
    return [...stubLine(acc), ...stubLine(line)];
  });

  return cleanContentStub.slice(0, 4).join("\n");
};
