import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";
import "components/Application.scss";

export default function Application(props) {

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

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);

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

  const schedule = appointments.map((appointment) => {

    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  })



  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
