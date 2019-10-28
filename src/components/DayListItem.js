import React from "react";

import "components/DayListItem.scss";
const classnames = require('classnames');

function FormatSpots(props) {
  const spotsLeft = props.spots;
  if (spotsLeft === 0) {
    return (<h3 className="text--light">no spots remaining</h3>)
  }
  if (spotsLeft === 1) {
    return (<h3 className="text--light">one spot remaining</h3>)
  }
  if (spotsLeft === 2) {
    return (<h3 className="text--light">two spots remaining</h3>)
  }
    return (<h3 className="text--light">{props.spots}</h3>)
}

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })

  return (
    <li
      className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <FormatSpots spots={props.spots} />
    </li>
  )
}