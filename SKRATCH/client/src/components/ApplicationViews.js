import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Sidebar from "./Sidebar";
import NotesDisplay from "./notes/NotesDisplay";
import TagDisplay from "./tags/TagDisplay";
import NoteDetails from "./notes/NoteDetails";
import Agenda from "./agenda/Agenda";
import "../App.css";

const sidebarLinks = [
  { name: "Notes", label: "Notes", route: "/notes" },
  {
    name: "Agenda",
    label: "Agenda",
    route: "/Agenda",
    items: [
      { name: "Today", label: "Today", route: "/Tag/Today" },
      { name: "Tomorrow", label: "Tomorrow", route: "/Tag/Tomorrow" },
      { name: "ThisWeek", label: "This_Week", route: "/Tag/ThisWeek" },
    ],
  },
  {
    name: "Priority",
    label: "Priority",
    route: "/Priority",
    items: [
      { name: "Urgent", label: "Urgent", route: "/Tag/Urgent" },
      { name: "Open", label: "Open", route: "/Tag/Open" },
    ],
  },
];

const ApplicationViews = ({ isLoggedIn, isAdmin }) => {
  const [sidebarItems, setSidebarItems] = useState(sidebarLinks);

  return (
    <main className="main">
      <Sidebar items={sidebarItems} />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>

        <Route path="/" exact>
          {isLoggedIn ? <NotesDisplay /> : <Redirect to="/login" />}
        </Route>
        <Route path="/notes" exact>
          {isLoggedIn ? <NotesDisplay /> : <Redirect to="/login" />}
        </Route>
        <Route path="/notes/:id" exact>
          {isLoggedIn ? <NoteDetails useParams /> : <Redirect to="/login" />}
        </Route>
        <Route path="/tags/:tagName" exact>
          {isLoggedIn ? <TagDisplay useParams /> : <Redirect to="/login" />}
        </Route>
        <Route path="/agenda" exact>
          {isLoggedIn ? <Agenda /> : <Redirect to="/login" />}
        </Route>
        <Route path="/priority" exact></Route>
      </Switch>
    </main>
  );
};

export default ApplicationViews;
