import reducer from "reducers/application";

// reducer takes in state and action
// call with empty state object and action type of null

describe("Application reducer", () => {
  it("should throw an error when given an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      "Tried to reduce with unsupported action type: null"
    )
  })
})