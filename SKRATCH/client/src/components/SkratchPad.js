import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import { useHistory } from "react-router";
import { getUserNotes } from "../modules/NoteManager";
import { getUserTags } from "../modules/TagManager";
import TagSideBar from "./TagSidebar";

const SkratchPad = () => {
  const history = useHistory();

  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  const getNotes = () => {
    getUserNotes().then((notes) => setNotes(notes));
  };

  const getTags = () => {
    getUserTags().then((resp) => setTags(resp));
  };

  useEffect(() => {
    getNotes();
    getTags();
  }, []);

  return (
    <div className="container">
      <div className="form-group">
        <TagSideBar tags={tags}></TagSideBar>
        <textarea></textarea>
      </div>
    </div>
  );
};

export default SkratchPad;
