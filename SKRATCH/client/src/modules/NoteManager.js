const baseUrl = "/api/note";

export const getUserNotes = (userId) => {
  console.log("fetching notes");

  return fetch(`${baseUrl}?userId=${userId}`).then((res) => res.json());
};

export const updateNote = (note) => {
  return fetch(`${baseUrl}/${note.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
};

export const addNote = (note) => {
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
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

// export const getNotesByCategoryId = (catId) => {
//   return fetch(baseUrl + `/GetNoteByCategoryId/${catId}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }).then((resp) => resp.json());
// };

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
