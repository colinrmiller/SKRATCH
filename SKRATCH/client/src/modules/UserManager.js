const userUrl = "/api/User";

export const GetAllUsers = () => {
  return fetch(userUrl).then((res) => res.json());
};

export const getUserByFireBaseUserId = (fireId) => {
  return fetch(userUrl + `/${fireId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const getUserById = (id) => {
  return fetch(userUrl + `/GetUserByUserId/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const updateUser = (id) => {
  return fetch(`${userUrl}/ActivateOrDeactivate/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
};
