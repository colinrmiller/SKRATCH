import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { cloneDeep } from "lodash";
import "./tags.css";

import { getUserTypedTags } from "../../modules/TagManager";

function TagSelectDropdown({ note, setNote, tagType }) {
  const currentUserId = 1;

  const [typedTags, setTypedTags] = useState([]);
  const [activeTag, setActiveTag] = useState(0);

  const updateNote = (event) => {
    const newValue = parseInt(event.target.value);
    const noteWithUpdatedActiveTags = replaceActiveTagForNote(
      activeTag,
      newValue
    );
    setNote([noteWithUpdatedActiveTags]);
    setActiveTag(newValue);
  };

  const replaceActiveTagForNote = (prevTagId, newTagId) => {
    let noteCopy = cloneDeep(note);
    let currentActiveTagIds = noteCopy.activeTagIds;

    currentActiveTagIds = currentActiveTagIds.filter((id) => id !== prevTagId);
    currentActiveTagIds.push(newTagId);

    noteCopy.activeTagIds = currentActiveTagIds;

    return noteCopy;
  };

  // set list of active and unactive tags for the note
  useEffect(() => {
    getUserTypedTags(currentUserId, tagType).then((tags) => {
      setTypedTags(tags);
      if (Array.isArray(note.activeTagIds)) {
        const activeTags = tags.filter((tag) =>
          note.activeTagIds.includes(tag.id)
        );
        activeTags.map((tag) => {
          tag.isActive = true;
          setActiveTag(tag.id);
          return tag;
        });
      }
    });
  }, [note]);

  return (
    <div className="tagdropdown">
      <List disablePadding dense>
        <h4 className="dropdown-header">{tagType.toUpperCase()}</h4>
        <select
          name="tagdropdown"
          id={`tagdropdown--${tagType}`}
          onChange={updateNote}
        >
          <option value={0} selected={activeTag === 0}>
            ...
          </option>
          {typedTags.map((tag) => (
            <option value={tag.id} selected={activeTag === tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </List>
    </div>
  );
}

export default TagSelectDropdown;
