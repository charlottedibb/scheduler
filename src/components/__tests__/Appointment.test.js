import React from "react";
import { render, cleanup } from "@testing-library/react";
import Appointment from "components/Appointment/index.js";

afterEach(cleanup);

describe("Appointment", () => {
  it("should render without crashing", () => {
    render(<Appointment />);
  });
});