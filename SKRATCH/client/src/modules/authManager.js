import firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import { getUserByFireBaseUserId } from "./UserManager";

const _apiUrl = "/api/User";

const _doesUserExist = (firebaseUserId) => {
  getUserByFireBaseUserId(firebaseUserId).then((user) => {
    localStorage.setItem("LoggedInUserId", user.id);
  });

  return getToken().then((token) =>
    fetch(`${_apiUrl}/DoesUserExist/${firebaseUserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => resp.ok)
  );
};

const _saveUser = (User) => {
  return getToken().then((token) =>
    fetch(_apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    }).then((resp) => resp.json())
  );
};

export const getToken = () => firebase.auth().currentUser.getIdToken();

export const login = (email, pw) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((signInResponse) => {
      return _doesUserExist(signInResponse.user.uid);
    })
    .then((doesUserExist) => {
      if (!doesUserExist) {
        // If we couldn't find the user in our app's database, we should logout of firebase
        logout();

        throw new Error(
          "Something's wrong. The user exists in firebase, but not in the application database."
        );
      }
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const logout = () => {
  firebase.auth().signOut();
  localStorage.clear();
};

export const register = (User, password) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(User.email, password)
    .then((createResponse) =>
      _saveUser({
        ...User,
        firebaseUserId: createResponse.user.uid,
      })
    );
};

export const onLoginStatusChange = (onLoginStatusChangeHandler) => {
  firebase.auth().onAuthStateChanged((user) => {
    onLoginStatusChangeHandler(!!user);
  });
};
