import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Datetime from "react-datetime";
import { cloneDeep } from "lodash";
import moment from "moment";
import "./tags.css";
import "react-datetime/css/react-datetime.css";
import { getCurrentDateTime } from "../../utils/utils";
import { getUserTypedTags } from "../../modules/TagManager";

function DateSelect({ note, setNote }) {
  const currentUserId = 1;

  const DATE_FORMAT = "MMM Do YYYY";

  const currentDateTime = moment().format(DATE_FORMAT);
  const [startDate, setStartDate] = useState(currentDateTime);
  const [endDate, setEndDate] = useState(currentDateTime);
  const [isActive, setIsActive] = useState(false);

  const updateNote = () => {
    const noteCopy = cloneDeep(note);
    noteCopy.startDate = startDate;
    noteCopy.endDate = endDate;
    setNote(noteCopy);
  };

  useEffect(() => {
    if (isActive) {
      updateNote();
    }
  }, [startDate, endDate]);

  const handleOnChangeStartDate = (time) => {
    setStartDate(time);
    if (time.isAfter(moment(endDate, DATE_FORMAT))) {
      setEndDate(time);
    }
  };

  const handleChecked = () => {
    setIsActive((value) => !value);
  };

  return (
    <div className="tagdropdown">
      <List disablePadding dense>
        <h4 className="dropdown-header">Add Date</h4>
        <input type="checkbox" onChange={handleChecked} checked={isActive} />

        {isActive ? (
          <>
            <h4 className="dropdown-header">Begin Date</h4>
            <Datetime
              dateFormat={DATE_FORMAT}
              closeOnSelect={true}
              value={startDate}
              onChange={handleOnChangeStartDate}
              timeFormat={false}
            />
            <h4 className="dropdown-header">End Date</h4>
            <Datetime
              dateFormat={DATE_FORMAT}
              closeOnSelect={true}
              value={endDate}
              onChange={(time) => setEndDate(time)}
              timeFormat={false}
            />
          </>
        ) : null}
      </List>
    </div>
  );
}

export default DateSelect;
