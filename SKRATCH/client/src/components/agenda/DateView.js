import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../notes/notes.css";

import { getUserNotes, getUpcomingUserNotes } from "../../modules/NoteManager";
import AgendaGroup from "./AgendaGroup";
import NoteList from "../notes/NoteList";
import NewNote from "../notes/NewNote";

const DateView = ({ notes }) => {
  const [shouldUpdateNotes, setShouldUpdateNotes] = useState(false);
  const [isDisplayingNewNote, setIsDisplayingNewNote] = useState(false);
  const [isNewNoteSubmitted, setIsNewNoteSubmitted] = useState(false);

  const [todaysNotes, setTodaysNotes] = useState([]);
  const [tomorrowsNotes, setTomorrowsNotes] = useState([]);
  const [overmorrowsNotes, setOvermorrowsNotes] = useState([]);
  const [overmorrowDay, setOvermorrowDay] = useState(null);
  const [upcomingsNotes, setUpcomingsNotes] = useState([]);

  const currentUser = 1;

  useEffect(() => {
    placeNotes();
  }, [notes]);

  const placeNotes = () => {
    const today = moment();
    const tomorrow = moment().add(1, "days");
    const overmorrow = moment().add(2, "days");
    const overOvermorrow = moment().add(3, "days");
    setOvermorrowDay(overmorrow.format("dddd"));

    const notesToday = [];
    const notesTomorrow = [];
    const notesOvermorrow = [];
    const notesUpcoming = [];

    notes.forEach((note) => {
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
  };

  return (
    <div className="notes-container calender">
      <h3>Today {moment().format("MMM Do")}</h3>
      {todaysNotes.length == 0 ? (
        <p className="agenda__no-content">No Events.</p>
      ) : (
        <AgendaGroup
          notes={todaysNotes}
          shouldUpdateNotes={shouldUpdateNotes}
        />
      )}
      <h3>Tomorrow {moment().add(1, "days").format("MMM Do")}</h3>
      {tomorrowsNotes.length == 0 ? (
        <p className="agenda__no-content">No Events.</p>
      ) : (
        <AgendaGroup
          notes={tomorrowsNotes}
          shouldUpdateNotes={shouldUpdateNotes}
        />
      )}
      <h3>
        {overmorrowDay} {moment().add(2, "days").format("MMM Do")}
      </h3>
      {overmorrowsNotes.length == 0 ? (
        <p className="agenda__no-content">No Events.</p>
      ) : (
        <AgendaGroup
          notes={overmorrowsNotes}
          shouldUpdateNotes={shouldUpdateNotes}
        />
      )}
      <h3>Upcoming</h3>

      {upcomingsNotes.length === 0 ? (
        <p className="agenda__no-content">No Events.</p>
      ) : (
        <AgendaGroup
          notes={upcomingsNotes}
          shouldUpdateNotes={shouldUpdateNotes}
        />
      )}
      <NewNote
        isDisplaying={isDisplayingNewNote}
        shouldSubmit={shouldUpdateNotes}
        setIsNewNoteSubmitted={setIsNewNoteSubmitted}
      />
    </div>
  );
};

export default DateView;
