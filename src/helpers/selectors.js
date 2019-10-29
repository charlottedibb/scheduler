import React from "react";

export function getAppointmentsForDay(state, day) {
  const result = [];

  const dayArray = state.days.filter(item => item.name === day);

  //return the empty result array if no appointments on a given day
  if (dayArray.length === 0) {
    return result;
  }

  //when id matches, push appt object to the to the result array
  dayArray[0].appointments.map(id => {
    if (state.appointments[id]) {
      result.push(state.appointments[id]);
    }
  })

  return result;
}