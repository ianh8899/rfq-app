//pages/outstandingrfqs

import React from "react"; // React library
import { useEffect, useState } from "react"; // React hooks
import axios from "axios"; // Module for making HTTP requests
import { useRouter } from "next/router";
import { parseCookies } from "nookies"; // Used for handling routing within the app

const OutstandingRFQs = () => {
  // Create state variables for rfqs and a router instance
  const [rfqs, setRfqs] = useState([]);
  const router = useRouter();

  // useEffect hook to fetch outstanding RFQs from the server
  useEffect(() => {
    // Retrieve the token from local storage
    const { token } = parseCookies(); // Read the cookies

    // Send a GET request to the server to retrieve RFQs, the token is included in the header
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rfq`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRfqs(res.data)) // Set the RFQs state with the data returned by the server
      .catch((err) => console.error(err)); // Log any errors
  }, []);

  return (
    <div>
      <style jsx>{`
        .rfq {
          display: grid;
          grid-template-columns: 8fr 1fr 1fr;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
          margin-top: 20px;
        }

        .rfq-item {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #333;
          color: #fff;
          border: 1px solid lightgrey;
          border-radius: 30px;
          padding: 5px;
          font-size: 1.5em; // h2 size
        }

        .rfq .status {
          width: 150px; // added this line to set fixed width
        }

        .rfq button {
          background-color: #333;
          border: none;
          border-radius: 30px;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          padding: 30px 20px;
          width: 150px;
        }

        .rfq button:hover {
          background-color: #000000;
        }
      `}</style>
      {rfqs.map((rfq) => (
        <div key={rfq._id} className="rfq">
          <div className="rfq-item name">
            <p>{rfq.name}</p>
          </div>
          <div
            className="rfq-item status"
            style={{ borderColor: rfq.status === "Open" ? "green" : "red" }}
          >
            <p>{rfq.status}</p>
          </div>
          <button
            className="rfq-item"
            onClick={() => router.push(`/rfq/${rfq._id}`)}
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
};

// Export the component for use in _app.js
export default OutstandingRFQs;
