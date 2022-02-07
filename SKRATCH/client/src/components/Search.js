import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { login, logout } from "../modules/authManager";
import { getUserTags } from "../modules/TagManager";
import "./ApplicationView.css";

function Search() {
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [userTags, setUserTags] = useState([]);

  const submitSearch = () => {
    history.push(`/tags/${query}`);
  };

  const currentUserId = 1; // TODO

  useEffect(() => {
    getUserTags(1).then((res) => setUserTags(res));
  }, []);

  return (
    <div className="search">
      <Input
        id="query"
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={submitSearch}>Search</Button>
    </div>
  );
}

export default Search;
