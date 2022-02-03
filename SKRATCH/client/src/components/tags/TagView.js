import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./tags.css";

import { getUserTags } from "../../modules/TagManager";

// modeled off of https://github.com/jsmanifest/modern-sidebar

function TagViewItem({
  note,
  setNote,
  tag,
  depthStep = 10,
  depth = 0,
  ...rest
}) {
  const history = useHistory();

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(tag.isActive);
  }, [tag]);

  const handleSelected = (event) => {
    setSelected(event.target.checked);
    const id = event.target.id.split("--")[1];
    addOrRemoveActiveTagToNote(parseInt(id));
  };

  const addOrRemoveActiveTagToNote = (tagId) => {
    const noteCopy = { ...note };
    let currentActiveTagIds = noteCopy.activeTagIds;

    if (currentActiveTagIds.includes(tagId)) {
      noteCopy.activeTagIds = currentActiveTagIds.filter((id) => id !== tagId);
    } else currentActiveTagIds.push(tagId);
    setNote([noteCopy]);
  };

  return (
    <>
      <ListItem button dense {...rest}>
        <ListItemText style={{ paddingLeft: depth * depthStep }}>
          <span
            onClick={() => history.push(`/tags/${tag.name}`)}
            className={tag.isActive ? "tag-view--active" : "tag-view--inactive"}
          >
            #{tag.name.toUpperCase()}
          </span>
          <input
            type="checkbox"
            id={`tag__checkbox--${tag.id}`}
            onChange={handleSelected}
            checked={selected}
          />
        </ListItemText>
      </ListItem>
      {Array.isArray(tag.childTags) ? (
        <List disablePadding dense>
          {tag.childTags.map((tag) => (
            <TagViewItem
              note={note}
              setNote={setNote}
              key={tag.name}
              depth={depth + 1}
              depthStep={depthStep}
              route={tag.name}
              {...tag}
            />
          ))}
        </List>
      ) : null}
    </>
  );
}

function TagView({ note, setNote }) {
  const currentUserId = 1;

  const [userTags, setUserTags] = useState([]);

  // set list of active and unactive tags for the nots
  useEffect(() => {
    getUserTags(currentUserId).then((tags) => {
      if (Array.isArray(note.activeTagIds)) {
        let activeIds = [...note.activeTagIds];
        const activeTags = tags.filter((tag) => activeIds.includes(tag.id));
        const inactiveTags = tags.filter((tag) => !activeIds.includes(tag.id));
        activeTags.map((tag) => {
          tag.isActive = true;
          return tag;
        });
        setUserTags(activeTags.concat(inactiveTags));
      }
    });
  }, [note]);

  return (
    <div className="tagview">
      <List disablePadding dense>
        <h4 className="dropdown-header">TAGS</h4>
        {userTags.map((tag, index) => (
          <TagViewItem
            key={`${tag.name}${index}`}
            note={note}
            setNote={setNote}
            tag={tag}
          />
        ))}
      </List>
    </div>
  );
}

export default TagView;
