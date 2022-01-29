import React, { useEffect, useState } from "react";
import { Table, Button } from "reactstrap";
import { useHistory } from "react-router";

const TagSidebar = ({ tags }) => {
  const [selected, setSelected] = useState(0);

  const handleSelectTag = (event) => {
    setSelected(event.target.Id);
  };

  return (
    <div className="tagSidebar">
      <div className="form-group">
        <label htmlFor="category">Filter By Category:</label>
        <TagSidebar tags={tags}></TagSidebar>
        <select
          value={selected}
          name="categoryId"
          id="categoryId"
          onChange={handleSelectTag}
          className="form-control"
        >
          <option value="0"></option>
          <option key={1} value={1}>
            URGNET
          </option>
          <option key={1} value={1}>
            STAGED
          </option>
          <option key={1} value={1}>
            C#
          </option>
          <option key={1} value={1}>
            SKRATCH
          </option>

          {/* {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))} */}
        </select>
      </div>
    </div>
  );
};

export default TagSidebar;
