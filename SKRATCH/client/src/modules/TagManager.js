const baseUrl = "/api/note";

export const getUserTags = (userId) => {
  return fetch(`baseUrl?userId=${userId}`).then((res) => res.json());
};

// export const addTags = (note) => {
//   if (note.userProfile.userType.name == "Admin") {
//     note.isApproved = true;
//   }
//   return fetch(baseUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(note),
//   });
// };

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
