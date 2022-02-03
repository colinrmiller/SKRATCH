import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useHistory, Link } from "react-router-dom";
import { login, logout } from "../modules/authManager";
import { getUserTags } from "../modules/TagManager";

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
      <Form onSubmit={submitSearch}>
        <fieldset>
          <FormGroup>
            <Input
              id="query"
              type="text"
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Button>Search</Button>
          </FormGroup>
        </fieldset>
      </Form>
    </div>
  );
}

export default Search;
