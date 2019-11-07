export default function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.day };
  }
  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days, //array of days
      appointments: action.appointments, //appointment objects
      interviewers: action.interviewers //interviewer objects
    };
  }
  if (action.type === SET_INTERVIEW) {
    const appointment = {
      ...state.appointments[action.id],
      interview: action.interview ? { ...action.interview } : null
    };
    const appointments = {
      ...state.appointments,
      [action.id]: appointment
    };

    const days = state.days.map(day => {
      //if appointment id not in day's array of appointments
      //return unchanged
      if (!day.appointments.includes(action.id)) {
        return day;
      }
      //start counter at zero
      let spotsTaken = 0;
      for (const apptId of day.appointments) {
        //if interview data is not null
        //increase spots taken counter by one
        if (appointments[apptId].interview) {
          spotsTaken = spotsTaken + 1;
        }
      }
      //set spots to length of appointments array minus spots taken
      const spots = day.appointments.length - spotsTaken;
      //return updated state object for that day
      return {
        ...day,
        spots
      };
    });

    return {
      ...state,
      days,
      appointments
    };
  }
  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  );
}

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
