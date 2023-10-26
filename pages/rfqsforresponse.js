//pages/rfsforresponse.js
import React, { useEffect, useState } from "react"; // React library // React hooks
import axios from "axios"; // Module for making HTTP requests
import { parseCookies } from "nookies"; // import parseCookies function from nookies

function SupplierRFQs() {
  // Use the useState hook to create a state variable for RFQs
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    async function fetchRFQs() {
      const { token, userId } = parseCookies(); // Read the cookies

      try {
        // Make a GET request to fetch all RFQs
        const rfqRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rfq/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Check if the request was successful
        if (rfqRes.status !== 200) {
          console.log(rfqRes.data); // This will log the server's response text
          throw new Error("RFQ Request not successful");
        }

        const fetchedRfqs = rfqRes.data;

        // For each RFQ, fetch its responses
        for (let i = 0; i < fetchedRfqs.length; i++) {
          const responseRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/response/` + fetchedRfqs[i]._id,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Check if the request was successful
          if (responseRes.status !== 200) {
            console.log(responseRes.data); // This will log the server's response text
            throw new Error("Response Request not successful");
          }

          // Find the response by the current user
          const supplierResponse = responseRes.data.find(
            (response) => response.createdBy === userId
          );
          if (supplierResponse) {
            fetchedRfqs[i].responseStatus = supplierResponse.status;
          } else {
            fetchedRfqs[i].responseStatus = "No Response";
          }
        }
        // Update the rfqs state variable
        setRfqs(fetchedRfqs);
      } catch (error) {
        console.error(error); //log if there is an error
      }
    }
    // Call the fetchRFQs function
    fetchRFQs();
  }, []);

  // Define a function to determine the border color based on the response status
  const determineBorderColor = (responseStatus) => {
    let borderColor = "lightgrey";
    switch (responseStatus) {
      case "Accepted":
        borderColor = "green";
        break;
      case "Pending":
        borderColor = "yellow";
        break;
      case "Rejected":
        borderColor = "red";
        break;
      default:
        break;
    }
    return borderColor;
  };

  return (
    <div>
      <style jsx>{`
        .rfq {
          display: grid;
          grid-template-columns: 8fr 1fr 1fr;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
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
          font-size: 1.5em;
        }

        .rfq .status {
          width: 150px;
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
      <h1>RFQs</h1>
      <ul>
        {rfqs.map((rfq) => (
          <div key={rfq._id} className="rfq">
            <div className="rfq-item name">
              <p>Name: {rfq.name}</p>
            </div>
            <div
              className="rfq-item status"
              style={{ borderColor: determineBorderColor(rfq.responseStatus) }}
            >
              <p>{rfq.responseStatus}</p>
            </div>
            <button
              className="rfq-item"
              onClick={() =>
                (window.location.href = "/responsetorfq/" + rfq._id)
              }
            >
              View
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}
// Export the component for use in _app.js
export default SupplierRFQs;
