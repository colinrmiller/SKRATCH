import React from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "./Sidebar.css";

// modeled off of https://github.com/jsmanifest/modern-sidebar

function SidebarItem({
  label,
  items,
  depthStep = 10,
  depth = 0,
  route,
  ...rest
}) {
  const history = useHistory();

  const handleNav = (route) => {
    history.push(route);
  };

  return (
    <>
      <ListItem button dense {...rest} onClick={() => handleNav(route)}>
        <ListItemText style={{ paddingLeft: depth * depthStep }}>
          <span>#{label.toUpperCase()}</span>
        </ListItemText>
      </ListItem>
      {Array.isArray(items) ? (
        <List disablePadding dense>
          {items.map((subItem) => (
            <SidebarItem
              key={subItem.name}
              depth={depth + 1}
              depthStep={depthStep}
              route={subItem.route}
              {...subItem}
            />
          ))}
        </List>
      ) : null}
    </>
  );
}

function Sidebar({ items, depthStep, depth }) {
  return (
    <div className="sidebar">
      <List disablePadding dense>
        {items.map((sidebarItem, index) => (
          <SidebarItem
            key={`${sidebarItem.name}${index}`}
            depthStep={depthStep}
            depth={depth}
            route={sidebarItem.route}
            {...sidebarItem}
          />
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
