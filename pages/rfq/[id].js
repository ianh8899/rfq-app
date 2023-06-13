//pages/rfq/[id].js
import { useRouter } from "next/router"; // Used for handling routing within the app
import React, { useEffect, useState } from "react"; // React library // React hooks
import axios from "axios"; // Module for making HTTP requests
import Link from "next/link";

const RfqDetails = () => {
  // Initialize state variables
  const [rfq, setRfq] = useState(null); // holds the RFQ data
  const [responses, setResponses] = useState([]); // holds the response to the RFQ
  const [editMode, setEditMode] = useState(false); // to toggle between edit and view mode
  const [rfqUpdates, setRfqUpdates] = useState(null); // rfqUpdates: Stores updates to the RFQ made in edit mode
  const router = useRouter(); // to access the router instance
  const { id } = router.query; // retrieve the RFQ id from the URL

  // function to fetch the RFQ and the associated responses
  const fetchRfqAndResponses = async () => {
    const token = localStorage.getItem("token"); // get token from local storage

    //fetch the RFQ
    const rfqResponse = await axios.get(`http://localhost:5000/rfq/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // fetch the responses to the RFQ
    const responsesResponse = await axios.get(
      `http://localhost:5000/response/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // For each response, fetch the corresponding user to include username in the response data
    const responsesWithUsernames = await Promise.all(
      responsesResponse.data.map(async (response) => {
        const userResponse = await axios.get(
          `http://localhost:5000/user/${response.createdBy}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return {
          ...response,
          createdBy: userResponse.data.username,
        };
      })
    );

    // Update RFQ and responses state with the fetched data
    setRfq(rfqResponse.data);

    // Initialize rfqUpdates state with the current RFQ data
    setRfqUpdates({
      name: rfqResponse.data.name,
      status: rfqResponse.data.status,
      about: rfqResponse.data.about,
      contractStartDate: rfqResponse.data.contractStartDate,
      annualVolume: rfqResponse.data.annualVolume,
      contractLength: rfqResponse.data.contractLength,
    });
    setResponses(responsesWithUsernames);
  };

  // useEffect hook to fetch the RFQ and responses once the component is mounted and whenever the id changes
  useEffect(() => {
    if (id) fetchRfqAndResponses();
  }, [id]);

  // function to toggle between edit and view mode of response
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // function to handle changes in the form field
  const handleInputChange = (event) => {
    setRfqUpdates({
      ...rfqUpdates,
      [event.target.name]: event.target.value,
    });
  };

  // Async function to submit changes to the RFQ
  // Sends a PUT request to update the RFQ data, then turns off edit mode and refreshes the data
  const submitChanges = async () => {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/rfq/${id}`, rfqUpdates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditMode(false);
    fetchRfqAndResponses();
  };
  // Function to change the status of a response
  const changeResponseStatus = async (responseId, currentStatus) => {
    const statusOrder = ["Pending", "Accepted", "Rejected"];
    const nextStatus =
      statusOrder[
        (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length
      ];

    // Send PUT request to update response status
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/response/${responseId}`,
      { status: nextStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Refresh data by calling fetchRfqAndResponses again
    fetchRfqAndResponses();
  };

  // If the RFQ data has not been fetched yet, show a loading message
  if (!rfq || !rfqUpdates) {
    return <p>Loading...</p>;
  }
  // Async function to delete the RFQ
  const deleteRfq = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/rfq/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    router.push("/outstandingrfqs"); // redirect to outstanding RFQs after deletion
  };

  return (
    <div className="container">
      {/* Inline CSS in JSX */}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .title {
          border-radius: 25px;
          padding: 20px;
          background-color: #333;
          text-align: center;
          color: white;
        }

        .rfq-details,
        .edit-mode {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .rfq-details > div,
        .edit-mode > div {
          background: #333;
          color: white;
          padding: 10px;
          border-radius: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .rfq-details > div:first-child.open {
          border: 2px solid green;
        }

        .rfq-details > div:first-child.closed {
          border: 2px solid red;
        }

        .edit-mode > div:nth-child(5),
        .rfq-details > div:nth-child(5) {
          grid-column: span 4;
        }

        .rfq-details > div:nth-child(5),
        .edit-mode textarea[name="about"] {
          height: 5em;
        }

        input,
        textarea,
        select {
          background: #414040;
          color: white;
          border-radius: 5px;
          width: 100%;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: white;
        }

        input,
        textarea,
        select,
        button {
          padding: 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
        }

        button {
          cursor: pointer;
          background: #333;
          color: white;
          border: none;
          border-radius: 25px;
          margin: 0 5px;
          width: 100%;
          height: 40px;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #555;
        }

        .edit-mode > div:last-child {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          justify-content: center;
          align-items: center;
          background: none;
        }

        .edit-button {
          width: 170px;
          padding: 10px;
          display: inline-block;
          margin: 0 auto;
        }

        .delete-button {
          width: 170px;
          padding: 10px;
          display: inline-block;
          margin: 0 auto;
          background: red;
        }

        .response-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: 10px;
          margin-bottom: 20px;
        }

        .response-grid > .pill {
          background: #333;
          color: white;
          padding: 10px;
          border-radius: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .response-grid > .pill.status.accepted {
          border: 2px solid green;
        }

        .response-grid > .pill.status.pending {
          border: 2px solid yellow;
        }

        .response-grid > .pill.status.rejected {
          border: 2px solid red;
        }

        .change-response {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .change-response > button {
          cursor: pointer;
          background: #333;
          color: white;
          border: none;
          border-radius: 25px;
          width: 200px;
          height: 50px;
          transition: background-color 0.3s ease;
        }

        .change-response > button:hover {
          background-color: #555;
        }

        .back-button {
          cursor: pointer;
          background: #333;
          color: white;
          border: none;
          border-radius: 25px;
          width: 200px;
          height: 50px;
          transition: background-color 0.3s ease;
          margin: 20px 0;
        }

        .back-button:hover {
          background-color: #555;
        }
      `}</style>

      <h2>Current RFQ</h2>
      <div className="pill title">
        <h2>{rfq.name}</h2>
      </div>
      {editMode ? (
        <div className="edit-mode">
          {/*Check whether the user is in Edit mode and display either the form or just the details*/}
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={rfqUpdates.status}
              onChange={handleInputChange}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label>Contract Start Date:</label>
            <input
              type="date"
              name="contractStartDate"
              value={rfqUpdates.contractStartDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Annual Volume:</label>
            <input
              type="number"
              name="annualVolume"
              value={rfqUpdates.annualVolume}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Contract Length:</label>
            <input
              type="number"
              name="contractLength"
              value={rfqUpdates.contractLength}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>About:</label>
            <textarea
              name="about"
              value={rfqUpdates.about}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <button onClick={submitChanges}>Submit Changes</button>
            <button onClick={toggleEditMode}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="rfq-details">
            <div className={`pill ${rfq.status.toLowerCase()}`}>
              <p>Status: {rfq.status}</p>
            </div>
            <div>
              <p>Contract Start Date: {rfq.contractStartDate}</p>
            </div>
            <div>
              <p>Annual Volume: {rfq.annualVolume}</p>
            </div>
            <div>
              <p>Contract Length: {rfq.contractLength}</p>
            </div>
            <div>
              <p className="about">{rfq.about}</p>
            </div>
          </div>
          <button className="edit-button" onClick={toggleEditMode}>
            Edit RFQ
          </button>
          <button className="delete-button" onClick={deleteRfq}>Delete RFQ</button>
        </>
      )}

      <h2>Responses</h2>
      {responses.map((response) => (
        <div key={response._id}>
          <div className="response-grid">
            <div className="pill">
              <p>Submitted by: {response.createdBy}</p>
            </div>
            <div className="pill">
              <p>Unit Price: {response.unitPrice}</p>
            </div>
            <div className="pill">
              <p>Investment: {response.investment}</p>
            </div>
            <div className="pill">
              <p>Currency: {response.currency}</p>
            </div>
            <div className={`pill status ${response.status.toLowerCase()}`}>
              <p>Status: {response.status}</p>
            </div>
            <div className="pill">
              <p>Comments: {response.comments}</p>
            </div>
          </div>
          <div className="change-response">
            <button
              onClick={() =>
                changeResponseStatus(response._id, response.status)
              }
            >
              Change Response Status
            </button>
          </div>
        </div>
      ))}
      <Link href="/outstandingrfqs">
        <button className="back-button">Go back</button>
      </Link>
    </div>
  );
};

// Export the component for use in _app.js
export default RfqDetails;
