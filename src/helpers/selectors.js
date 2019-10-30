
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

// getInterview takes in an object that contains the interviewer 
// returns a new object containing the interview data 
// otherwise, returns null 

// example output:
// {  
//   "student": "Lydia Miller-Jones",
//   "interviewer": {  
//     "id": 1,
//     "name": "Sylvia Palmer",
//     "avatar": "https://i.imgur.com/LpaY82x.png"
//   }
// }

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const result = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
  return result;
}