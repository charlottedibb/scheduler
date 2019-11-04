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
    return {
      ...state,
      days: state.days, //not sure if this is best practice
      appointments: action.appointments
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
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
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
  // makes put request to add interview to database
  // then sets state
  function bookInterview(id, interview) {
    // will use "appointment" as the data in the axios put request
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // will use "appointments" to update state once axios request is complete
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios({
      method: 'put',
      url: `http://localhost:8001/api/appointments/${id}`,
      data: appointment
    })
      .then(() => {
        //updates days state - not sure if this is best practice
        state.days.map(day => {
          if (day.name !== state.day) {
            return day;
          }
          return {
            ...day,
            spots: day.spots--
          }
        })
        dispatch({ type: SET_INTERVIEW, appointments });
      });
  }

  // uses the appointment id to find the right appointment slot 
  // and set its interview data to null
  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null // interview is set to null
    };
    // will use "appointments" to update state once axios request is complete
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {
        //updates days state - not sure if this is best practice
        state.days.map(day => {
          if (day.name !== state.day) {
            return day;
          }
          return {
            ...day,
            spots: day.spots++
          }
        })
        dispatch({ type: SET_INTERVIEW, appointments });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}