import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then((response) => {
      setState(prev => ({
        ...prev,
        days: response[0].data, //array of days
        appointments: response[1].data, //appointment objects
        interviewers: response[2].data //interviewer objects
      }));
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
        setState({ ...state, appointments });
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
        setState({ ...state, appointments });
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}