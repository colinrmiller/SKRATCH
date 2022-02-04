import { ParseNoteTags, isContentNull } from "../utils/utils";
import { addNoteTag, removeNoteTag } from "./TagManager";
import { difference } from "lodash";

const baseUrl = "/api/note";

export const getUserNotes = (userId) => {
  return fetch(`${baseUrl}?userId=${userId}`).then((res) => res.json());
};

export const getUpcomingUserNotes = (userId) => {
  return fetch(`${baseUrl}/upcoming?userId=${userId}`).then((res) =>
    res.json()
  );
};

export const getNoteById = (noteId) => {
  return fetch(`${baseUrl}/${noteId}`).then((res) => res.json());
};

export const updateNote = (note) => {
  if (isContentNull(note.content)) {
    return fetch(`${baseUrl}/${note.id} `, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  } else {
    return fetch(`${baseUrl}/${note.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
  }
};

export const updateNoteTags = (note) => {
  const currentTags = note.tags.map((tag) => tag.id);
  const updatedTags = note.activeTagIds;

  const tagsToRemove = difference(currentTags, updatedTags);
  const tagsToAdd = difference(updatedTags, currentTags);
  debugger;
  // foreach updatedTagId POST
  tagsToAdd.forEach((tagId) => {
    const newNoteTag = {
      tagId: tagId,
      noteId: note.id,
    };
    addNoteTag(newNoteTag);
  });
  tagsToRemove.forEach((tagId) => {
    const newNoteTag = {
      tagId: tagId,
      noteId: note.id,
    };
    removeNoteTag(newNoteTag);
  });
};

export const addNote = (note) => {
  const noteCopy = { ...note };
  noteCopy.content = noteCopy.content += "\n";

  const noteTags = ParseNoteTags(noteCopy.content);

  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteCopy),
  }).then((res) => res.json());
};

// export const getBySearch = (q, isSort) => {
//   return fetch(baseUrl + `/search?q=${q}&sortDesc=${isSort}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((res) => res.json());
// };

// export const getNoteById = (noteId) => {
//   return fetch(baseUrl + `/${noteId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

export const getNotesByTagName = (tagName, userId) => {
  return fetch(baseUrl + `/NotesByTagName/${tagName}?userid=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((resp) => resp.json());
};

// export const getNotesByUserId = (userId) => {
//   return fetch(baseUrl + `/GetNotesByUserId/${userId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

// export const deleteNoteById = (noteId) => {
//   return fetch(baseUrl + `/${noteId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// export const getNotesBySubscription = (subId) => {
//   return fetch(baseUrl + `/GetSubscribedNotes/${subId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };
