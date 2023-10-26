//pages/newrfq.test.js

jest.mock("nookies", () => ({
  parseCookies: jest.fn().mockReturnValue({ token: "fakeToken" }),
}));

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import NewRFQ from "./newrfq";

beforeEach(() => {
  // Mock the localStorage object
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  global.localStorage.getItem.mockReset();
  global.localStorage.setItem.mockReset();
  global.localStorage.clear.mockReset();
});

test("submitting the form makes a POST request with form data", async () => {
  // Mock the axios post method
  axios.post = jest.fn(() => Promise.resolve({ data: {} }));

  const { getByLabelText, getByText } = render(<NewRFQ />);

  // Fill out the form
  fireEvent.change(getByLabelText(/Name:/i), {
    target: { value: "Test RFQ" },
  });
  fireEvent.change(getByLabelText(/Contract Start Date:/i), {
    target: { value: "2023-06-01" },
  });
  fireEvent.change(getByLabelText(/About:/i), {
    target: { value: "This is a test RFQ." },
  });
  fireEvent.change(getByLabelText(/Annual Volume:/i), {
    target: { value: "10000" },
  });
  fireEvent.change(getByLabelText(/Contract Length:/i), {
    target: { value: "12" },
  });

  // Submit the form
  fireEvent.click(getByText(/Release RFQ/i));

  await waitFor(() =>
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/rfq",
      {
        name: "Test RFQ",
        contractStartDate: "2023-06-01",
        about: "This is a test RFQ.",
        annualVolume: "10000",
        contractLength: "12",
      },
      {
        headers: { Authorization: "Bearer fakeToken" },
      }
    )
  );
});
