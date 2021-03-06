const baseUrl = "/api/tag";

export const getUserTags = (userId) => {
  return fetch(`${baseUrl}/TagsByUserId/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const addTag = (tag) => {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tag),
  }).then((res) => res.json());
};

export const addNoteTag = (noteTag) => {
  return fetch("/api/notetag/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteTag),
  });
};

export const removeNoteTags = (noteId) => {
  return fetch(`/api/notetag/clearnote/${noteId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const removeNoteTag = (noteTag) => {
  return fetch(`/api/notetag/clearnotetag/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteTag),
  });
};

export const getUserTypedTags = (userId, tagType) => {
  return fetch(`${baseUrl}/TagsByUserIdByType/${userId}?type=${tagType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const getPriorities = () => {
  return fetch(`${baseUrl}/Priorities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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

// export const getTagsById = (noteId) => {
//   return fetch(baseUrl + `/${noteId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

// export const getTagssByCategoryId = (catId) => {
//   return fetch(baseUrl + `/GetTagsByCategoryId/${catId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

// export const getTagssByUserId = (userId) => {
//   return fetch(baseUrl + `/GetTagssByUserId/${userId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

// export const deleteTagsById = (noteId) => {
//   return fetch(baseUrl + `/${noteId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// export const updateTags = (note) => {
//   return fetch(`${baseUrl}/${note.id}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(note),
//   });
// };
// export const getTagssBySubscription = (subId) => {
//   return fetch(baseUrl + `/GetSubscribedTagss/${subId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };
