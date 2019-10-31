import React from "react";
import "components/Appointment/styles.scss"
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // creates an interview object that will be passed to bookInterview
  // called from Form

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    })
  }

  function cancel() {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={props.onEdit}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === SAVING && (
        <Status />
      )}
      {mode === DELETING && (
        <Status message="Deleting"/>
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={cancel}
          onCancel={() => back()} />
      )}
    </article>
  )
}