import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  if (action.type === SET_DAY) {
    return { ...state, day: action.day }
  }
  if (action.type === SET_APPLICATION_DATA) {
    return {
      ...state,
      days: action.days, //array of days
      appointments: action.appointments, //appointment objects
      interviewers: action.interviewers //interviewer objects
    }
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
      }
    })

    return {
      ...state,
      days,
      appointments
    }
  }
  throw new Error(
    `Tried to reduce with unsupported action type: ${action.type}`
  )
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = function (day) {
    dispatch({ type: SET_DAY, day });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((response) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: response[0].data, //array of days
        appointments: response[1].data, //appointment objects
        interviewers: response[2].data //interviewer objects
      })
    })
  }, [])

  // called with interview and interview id from save function
  // makes put request to add interview to database, then dispatch to set state
  function bookInterview(id, interview) {
    // will use "appointment" as the data in the axios put request
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  }

  // uses the appointment id to find the right appointment slot
  // and set its interview data to null
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}