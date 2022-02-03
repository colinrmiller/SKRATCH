import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../notes/notes.css";

import { getUserNotes, getUpcomingUserNotes } from "../../modules/NoteManager";
import PriorityGroup from "./PriorityGroup";
import NoteList from "../notes/NoteList";
import NewNote from "../notes/NewNote";
import { over } from "lodash";

function Priority() {
  const [notes, setNotes] = useState([]);
  const [shouldUpdateNotes, setShouldUpdateNotes] = useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);
  const [isNewNoteSubmitted, setIsNewNoteSubmitted] = useState(false);

  const [todaysNotes, setTodaysNotes] = useState([]);
  const [tomorrowsNotes, setTomorrowsNotes] = useState([]);
  const [overmorrowsNotes, setOvermorrowsNotes] = useState([]);
  const [overmorrowDay, setOvermorrowDay] = useState(null);
  const [upcomingsNotes, setUpcomingsNotes] = useState([]);

  const currentUser = 1;

  const getNotes = () => {
    getUpcomingUserNotes(currentUser).then((resNotes) => {
      const today = moment();
      const tomorrow = moment().add(1, "days");
      const overmorrow = moment().add(2, "days");
      const overOvermorrow = moment().add(3, "days");
      setOvermorrowDay(overmorrow.format("dddd"));

      const notesToday = [];
      const notesTomorrow = [];
      const notesOvermorrow = [];
      const notesUpcoming = [];

      resNotes.forEach((note) => {
        const noteStart = moment(note.startDate);
        const noteEnd = moment(note.endDate);
        if (noteStart.isBefore(tomorrow)) {
          notesToday.push(note);
        }
        if (noteStart.isBefore(overmorrow) && noteEnd.isAfter(today)) {
          notesTomorrow.push(note);
        }
        if (noteStart.isBefore(overOvermorrow) && noteEnd.isAfter(overmorrow)) {
          notesOvermorrow.push(note);
        }
        if (noteStart.isBefore(overmorrow) && noteEnd.isAfter(overOvermorrow)) {
          notesUpcoming.push(note);
        }
      });

      setTodaysNotes(notesToday);
      setTomorrowsNotes(notesTomorrow);
      setOvermorrowsNotes(notesOvermorrow);
      setUpcomingsNotes(notesUpcoming);
    });
  };

  useEffect(() => {
    getNotes();
  }, [isNewNoteSubmitted]);

  const handleUpdateNotes = (event) => {
    event.preventDefault();
    setShouldUpdateNotes((value) => !value);
  };

  const handleNewNote = () => {
    setIsDisplayingNewNote(true);
  };

  const handleNewNoteCancel = () => {
    setIsDisplayingNewNote(false);
  };

  useEffect(() => {});

  return (
    <div className="notes-container">
      <h3>Tomorrow {moment().format("MMM Do")}</h3>
      <PriorityGroup
        notes={todaysNotes}
        shouldUpdateNotes={shouldUpdateNotes}
      />
      <h3>Tomorrow {moment().add(1, "days").format("MMM Do")}</h3>
      <PriorityGroup
        notes={tomorrowsNotes}
        shouldUpdateNotes={shouldUpdateNotes}
      />
      <h3>
        {overmorrowDay} {moment().add(2, "days").format("MMM Do")}
      </h3>
      {overmorrowsNotes.length == 0 ? (
        <p className="agenda__no-content">No Events.</p>
      ) : (
        <PriorityGroup
          notes={overmorrowsNotes}
          shouldUpdateNotes={shouldUpdateNotes}
        />
      )}
      <h3>Upcoming</h3>
      <PriorityGroup
        notes={upcomingsNotes}
        shouldUpdateNotes={shouldUpdateNotes}
      />
      <NewNote
        isDisplaying={isDisplayingNewNote}
        shouldSubmit={shouldUpdateNotes}
        setIsNewNoteSubmitted={setIsNewNoteSubmitted}
      />
      <div className="notes-container--interaction">
        <button onClick={handleUpdateNotes}>Update</button>
        {isDisplayingNewNote ? (
          <button onClick={handleNewNoteCancel}>Cancel</button>
        ) : (
          <button onClick={handleNewNote}>New Note</button>
        )}
      </div>
    </div>
  );
}

export default Priority;
