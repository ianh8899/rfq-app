//pages/responsetorfq/[id].js
import {useRouter} from 'next/router' // Used for handling routing within the app
import React, {useEffect, useState} from 'react' // React library // React hooks
import axios from 'axios' // Module for making HTTP requests
import Link from "next/link";

const RfqDetails = () => {
    // Initialize state variables
    const [rfq, setRfq] = useState(null) // holds the RFQ data
    const [response, setResponse] = useState(null) // holds the response to the RFQ
    const [responseUpdates, setResponseUpdates] = useState({
        unitPrice: '',
        investment: '',
        currency: '',
        comments: '',
    }) // holds the updates for the response
    const [responseEditMode, setResponseEditMode] = useState(false) // to toggle between edit and view mode of response
    const [errorMessage, setErrorMessage] = useState(null) // holds any error messages
    const router = useRouter() // to access the router instance
    const {id} = router.query // retrieve the RFQ id from the URL

    // function to fetch the RFQ and the associated responses
    const fetchRfqAndResponse = async () => {
        const token = localStorage.getItem('token'); // get token from local storage
        const userId = localStorage.getItem('userId'); // get user id from local storage

        if (!token || !userId) {
            console.error('Token or user ID is missing'); //error message if details cannot be retrieved from localStorage
            return;
        }

        try {
            //fetch the RFQ
            const rfqResponse = await axios.get(`http://localhost:5000/rfq/${id}`, {headers: {'Authorization': `Bearer ${token}`}})

            // fetch the responses to the RFQ
            const responseResponse = await axios.get(`http://localhost:5000/response/${id}`, {headers: {'Authorization': `Bearer ${token}`}})

            setRfq(rfqResponse.data) // save the RFQ data to state
            const supplierResponse = responseResponse.data.find(res => res.createdBy === userId); // get the response of the current user
            setResponse(supplierResponse) // save the user's response to state
            // update the form fields with the user's response
            setResponseUpdates({
                unitPrice: supplierResponse?.unitPrice,
                investment: supplierResponse?.investment,
                currency: supplierResponse?.currency,
                comments: supplierResponse?.comments,
            })
        } catch (err) {
            console.error(err);
            setErrorMessage('Error fetching RFQ and Response'); // set the error message
        }
    }

    // useEffect hook to fetch the RFQ and responses once the component is mounted and whenever the id changes
    useEffect(() => {
        if (id) fetchRfqAndResponse()
    }, [id])

    // function to toggle between edit and view mode of response
    const toggleResponseEditMode = () => {
        setResponseEditMode(!responseEditMode)
    }

    // function to handle changes in the form field
    const handleResponseInputChange = (event) => {
        setResponseUpdates({
            ...responseUpdates,
            [event.target.name]: event.target.value
        });
    };

    /* This function will be called when the user submits their response. If the RFQ is already closed, the function will set an error message and return immediately.
    Otherwise, it will fetch the user's token and ID from localStorage, create an object to represent the updated response, and
    attempt to update or create the response on the server via an HTTP request.*/
    const submitResponse = async () => {
        // Check if RFQ status is 'Closed'. If so, set an error message and return.
        if (rfq.status === 'Closed') {
            setErrorMessage('RFQ is closed. New responses cannot be submitted.');
            return;
        }

        // Fetch the token and user ID from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // Create an object to represent the updated response
        const updatedResponse = {
            rfq: id,
            unitPrice: responseUpdates.unitPrice,
            investment: responseUpdates.investment,
            currency: responseUpdates.currency,
            comments: responseUpdates.comments,
            createdBy: userId,
            status: 'Pending'
        };

        try {
            // Check if a response already exists.
            // If so, update the existing response using a PUT request.
            // If not, create a new response using a POST request.
            if (response) {
                await axios.put(`http://localhost:5000/response/${response._id}`, updatedResponse, {headers: {'Authorization': `Bearer ${token}`}});
            } else {
                await axios.post(`http://localhost:5000/response`, updatedResponse, {headers: {'Authorization': `Bearer ${token}`}});
            }

            // After the response is submitted, refetch the RFQ and response data.
            fetchRfqAndResponse();

            // Toggle the editing mode back to false ONLY if it's currently true. I.e. it is toggled when used in editing mode rather than on first submission
            if(responseEditMode) {
                toggleResponseEditMode();
            }
        } catch (err) {
            // Log any errors and set an error message.
            console.error("Error submitting response: ", err.response);
            setErrorMessage('Error submitting response');
        }
    }


// If the RFQ data has not been fetched yet, show a loading message
    if (!rfq) {
        return <p>Loading...</p>
    }

    return (
        <div className="container">
            <style jsx>{`
              {/* Inline CSS in JSX */}
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

              .rfq-details, .edit-mode {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
              }

              .rfq-details > div, .edit-mode > div {
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


              .edit-mode > div:nth-child(5), .rfq-details > div:nth-child(5) {
                grid-column: span 4;
              }

              .rfq-details > div:nth-child(5), .edit-mode textarea[name="about"] {
                height: 5em;
              }

              input, textarea, select {
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

              input, textarea, select, button {
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
            {/*Show the RFQ details*/}
            <div className="pill title">
                <h2>{rfq.name}</h2>
            </div>
            <div className="rfq-details">
                <div className={`pill ${rfq.status.toLowerCase()}`}><p>Status: {rfq.status}</p></div>
                <div><p>Contract Start Date: {rfq.contractStartDate}</p></div>
                <div><p>Annual Volume: {rfq.annualVolume}</p></div>
                <div><p>Contract Length: {rfq.contractLength}</p></div>
                <div><p className="about">{rfq.about}</p></div>
            </div>
            {errorMessage && <p className="pill">{errorMessage}</p>}

            <h2>Response</h2>
            {/*Check whether the user is in Edit mode and display either the form or just the details*/}
            {response ? (
                responseEditMode ? (
                    <div className="edit-mode">
                        <div>
                            <label>
                                Unit Price:
                                <input type="number" name="unitPrice" value={responseUpdates.unitPrice}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Investment:
                                <input type="number" name="investment" value={responseUpdates.investment}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Currency:
                                <input type="text" name="currency" value={responseUpdates.currency}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Comments:
                                <textarea name="comments" value={responseUpdates.comments}
                                          onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            {rfq.status &&
                                <button disabled={rfq.status === 'Closed'} onClick={submitResponse}>Save</button>}
                            {rfq.status && <button disabled={rfq.status === 'Closed'}
                                                   onClick={toggleResponseEditMode}>Cancel</button>}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="response-grid">
                            <div className={`pill status ${response.status.toLowerCase()}`}>
                                <p>Status: {response.status}</p></div>
                            <div className="pill"><p>Unit Price: {response.unitPrice}</p></div>
                            <div className="pill"><p>Investment: {response.investment}</p></div>
                            <div className="pill"><p>Currency: {response.currency}</p></div>
                            <div className="pill"><p>Comments: {response.comments}</p></div>
                        </div>
                        {/*Check whether the rfq or response have been closed or accepted and then hide or disable the button if either have*/}
                        {response.status !== "Accepted" && rfq.status !== "Closed" &&
                            <button className="edit-button" disabled={rfq.status === 'Closed'}
                                    onClick={toggleResponseEditMode}>Edit Response</button>}
                    </>
                )
            ) : (
                <>
                    <p>You haven't submitted a response yet.</p>
                    <h2>Create a new response</h2>
                    <div className="edit-mode">
                        <div>
                            <label>
                                Unit Price:
                                <input type="number" name="unitPrice" value={responseUpdates.unitPrice || ''}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Investment:
                                <input type="number" name="investment" value={responseUpdates.investment || ''}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Currency:
                                <input type="text" name="currency" value={responseUpdates.currency || ''}
                                       onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            <label>
                                Comments:
                                <textarea name="comments" value={responseUpdates.comments || ''}
                                          onChange={handleResponseInputChange}/>
                            </label>
                        </div>
                        <div>
                            {rfq.status && <button disabled={rfq.status === 'closed'} onClick={submitResponse}>Submit
                                Response</button>}
                        </div>
                    </div>
                </>
            )}
            <Link href="/rfqsforresponse">
                <button className="back-button">Go back</button>
            </Link>
        </div>
    )
}

// Export the component for use in _app.js
export default RfqDetails