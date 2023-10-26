//pages/newrfq.snapshot.js

// Import necessary modules
import React from "react"; // React library for building user interfaces
import renderer from "react-test-renderer"; // react-test-renderer for snapshot testing
import NewRFQ from "../pages/newrfq"; // Importing the NewRFQ component that you want to test

// Test for the NewRFQ component
test("renders correctly", () => {
  // Generate a snapshot tree for the NewRFQ component
  const tree = renderer.create(<NewRFQ />).toJSON(); // Converts the rendered output to a JSON object
  // Expect the snapshot of the NewRFQ component to match the saved snapshot
  // If they don't match, either the component has changed which will require a new snapshot, or there is an unintended difference
  expect(tree).toMatchSnapshot();
});
