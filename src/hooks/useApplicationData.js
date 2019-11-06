import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

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