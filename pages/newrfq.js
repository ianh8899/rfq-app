//pages/newrfq.js

import React, { useState } from "react"; // React library // React hooks
import axios from "axios";
import { parseCookies } from "nookies"; // Module for making HTTP requests

const NewRFQ = () => {
  // Using useState hook to create state variables for each field in the RFQ form and the response message
  const [name, setName] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [about, setAbout] = useState("");
  const [annualVolume, setAnnualVolume] = useState("");
  const [contractLength, setContractLength] = useState("");
  const [message, setMessage] = useState("");

  const submitRFQ = async (e) => {
    e.preventDefault(); // prevent default form submission
    try {
      // Create an RFQ object with the form data
      const rfq = {
        name,
        contractStartDate,
        about,
        annualVolume,
        contractLength,
      };
      const token = parseCookies().token; // Read the cookies
      // Send a POST request to the server with the RFQ object and the token in the header
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rfq`, rfq, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If the request is successful, display a success message and clear the form
      setMessage("RFQ released successfully!");
      clearTemplate();
    } catch (err) {
      // If an error occurs, display the error message
      setMessage(err.response.data);
    }
  };

  // Function to clear the RFQ form
  const clearTemplate = () => {
    setName("");
    setContractStartDate("");
    setAbout("");
    setAnnualVolume("");
    setContractLength("");
  };

  return (
    <div>
      <h2>Create New RFQ</h2>
      <form onSubmit={submitRFQ}>
        <div>
          <label htmlFor="rfqName">RFQ Name:</label>
          <input
            id="rfqName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contractStartDate">Contract Start Date:</label>
          <input
            id="contractStartDate"
            type="date"
            value={contractStartDate}
            onChange={(e) => setContractStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="annualVolume">Annual Volume:</label>
          <input
            id="annualVolume"
            type="number"
            value={annualVolume}
            onChange={(e) => setAnnualVolume(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contractLength">Contract Length:</label>
          <input
            id="contractLength"
            type="number"
            value={contractLength}
            onChange={(e) => setContractLength(e.target.value)}
            required
          />
        </div>
        <button type="submit">Release RFQ</button>
        <button type="button" onClick={clearTemplate}>
          Clear Template
        </button>
      </form>
      <p>{message}</p>
      <style jsx>{`
        label {
          display: block;
          margin-bottom: 5px;
        }
        input,
        textarea,
        button {
          font-family: "Roboto", sans-serif;
          border-radius: 5px;
          border: none;
          padding: 10px;
          margin-bottom: 20px;
        }
        input,
        textarea {
          width: 100%;
          background-color: #333;
          color: #fff;
        }
        textarea {
          height: 100px;
        }
        button {
          color: #fff;
          background-color: #007bff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 18px;
          margin-right: 20px;
        }
        button:hover {
          background-color: #0056b3;
        }
        button[type="button"] {
          background-color: #333;
        }
        button[type="button"]:hover {
          background-color: #1a1a1a;
        }
      `}</style>
    </div>
  );
};

// Export the component for use in _app.js
export default NewRFQ;
