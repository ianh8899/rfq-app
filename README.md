# Software Requirements Documentation for RFQ (request for quotation) MERN Application
### System Architecture
The application will follow a 3-tier architecture:

1) Front-End (Presentation Layer): This layer will be responsible for presenting the data to the user and receiving user input. 
It will be built using React.js.

2) Back-End (Application Logic Layer): This layer will handle data processing, user authentication, and business logic. 4
It will be built using Express.js and Node.js.

3) Database (Data Layer): This layer will store and retrieve application data. MongoDB will be used for this purpose.

### Web Stack: MERN

- MongoDB: A NoSQL database that provides flexibility in handling data.
- Express.js: A Node.js framework that simplifies server-side development.
- Next.js: A React.js framework that enables server-side rendering and generates static websites for React based web applications.
- Node.js: A runtime environment for executing JavaScript outside the browser.

### Motivation for Architecture Choice
The MERN stack provides several benefits:

- Single Language Usage: The entire application is built using JavaScript, which simplifies development and maintenance.
- Performance: Node.js is non-blocking, which makes it fast, and MongoDB can handle large amounts of data efficiently.
- Community Support: MERN stack has a large community, which means easy access to libraries, tools, and support.

### Deployment
The application can be deployed using platforms like Heroku or AWS. MongoDB Atlas can be used to host the MongoDB database.

### Use of Next.js
Next.js simplifies the setup of a modern web application by providing a comprehensive solution for server-rendered React applications. 
It offers functionalities like server-side rendering and static site generation out of the box, which can lead to better performance and improved SEO. 
It also supports dynamic routing, which is beneficial for our RFQ application as we plan to have dynamic pages for each RFQ.

### Styling Tools
We will use a combination of styled-components and Material-UI. 
These libraries offer a collection of customizable components, support for responsive design, and have a large community.

### System Requirements Specification
The RFQ application will allow buyers and suppliers to interact over procurement needs. 
Buyers post RFQs, and suppliers can respond to them. 
This platform provides a single point of communication, making procurement more efficient.

### User Stories
- Sally, a buyer, who runs a small bakery needs a simple way to create RFQs for sourcing quality ingredients. She wants to spend less time on emails and more time baking.
- Tom, a supplier specializing in organic farming, wants to view all open RFQs to understand the market's demand and identify the needs of Sally in a fast efficient way.
- Vanessa, another supplier, who is a distributor of baking equipment, wishes to respond to RFQs and propose her products to potential clients.
- Sally, a buyer, wants to view all responses to her RFQs in one place and choose the best supplier who can meet the demands of her bakery.
- Tina, a sales representative wants to track when her responses are accepted so can quickly update her company about sales forecasts.  

### Competitor Analysis
There are platforms like SAP Ariba, Zycus, and Coupa that offer similar services. 
However, those applications are enterprise platforms and thus complicated, expensive to license and resource intensive to maintain.
This app will be much simpler to use at the expense of some functionality. A better fit for much smaller organisations. 


### Functional Requirements
1) User Authentication: Sally, Tom, Vanessa, or Tina should be able to securely log in to their respective accounts using their credentials. They will input their username and password in the login form and be granted access upon successful authentication.
2) Posting, Editing, and Deleting RFQs: After logging in, buyers like Sally should have the ability to post a new RFQ by filling out a form on the user interface with the details of her procurement needs. Once an RFQ is posted, she should be able to review it and make changes if needed.
3) Viewing RFQs: On the supplier side, users like Tom and Vanessa should be presented with a list of all open RFQs upon logging in. The interface should allow them to browse through the list and just click on one to respond.
4) Submitting, Editing, and Managing Responses to RFQs: Suppliers should also have an interface where they can submit responses to RFQs. They would do this by selecting an RFQ and filling out a response form. After submitting a response, they should have the ability to review, and if necessary, edit their responses.
5) Viewing and Accepting Responses: On the buyer's side, users like Sally should be able to view all responses to their posted RFQs. The responses should be listed in a clear, organized manner, making it easy for Sally to compare them. When she has chosen the best response, she should be able to accept which responses she wants at the click of a button and can close the RFQ.
6) Dashboard for Tracking RFQs: Each user should have access to a personalized dashboard upon logging in. This dashboard should provide an overview of their RFQs and responses, allowing them to easily track their progress. They should be able to navigate to specific RFQs or responses from this dashboard.

### Non-Functional Requirements
- Usability: User-friendly interface
- Performance: Quick response times
- Security: Secure user data and prevent unauthorized access
- Scalability: Handle increasing number of users and RFQs
- Reliability: Minimal downtime, quick recovery from failures

### Installation
To install and run the app on your local machine, follow these steps:

1) Clone the repository to your local machine using command "git clone https://github.com/ianh8899/rfq-app"
2) Change into the project directory using command: "cd rfq-app"
3) Create a .env file in the root directory and add your MongoDB URI (MONGODB_URI="your-MongoDB-URI-goes here") and JWT token (TOKEN_SECRET="your-jwt-secret-token-goes-here").
4) Start the application using command: "npm start"

This will start the backend server on port 5000 and the frontend React app on port 3000. Open your web browser and navigate to http://localhost:3000 to access the app.

### Testing

1) Make sure the app is running after the following the steps in the installation steps
2) In the console use the command: "npm run test"

### Security

1) Environmental Variables: Sensitive data such as database connections (MONGODB_URI) and secret keys for JWT (TOKEN_SECRET) are stored in environment variables using dotenv. This prevents exposure of these important keys and connections strings in the source code, reducing the risk of unwanted access.
2) JSON Web Tokens (JWT): JWTs are used for user authentication. Once the user logs in, a JWT is generated and returned to the user. The token is then used to authenticate the user in subsequent requests. This eliminates the need for the user to constantly provide credentials, and the server to repeatedly validate the credentials against the database. Also, the JWT is signed with a secret key, which helps in verifying the integrity of the token.
3) Middleware for Token Verification: A middleware function is used to verify the JWT in every request made to certain routes (rfqRoutes and responseRoutes). This ensures only authenticated users can access these routes.
4) Data Validation: The user registration endpoint validates the input data such as checking if the username already exists, and password length must be between 8 and 1024 characters. This prevents data injection attacks and safeguards the integrity of the database.
5) Password Hashing: User passwords are hashed using bcrypt before storing in the database. This adds a layer of security, as even if someone gets access to the database, they will not be able to see the original passwords.
6) Role-Based Access Control (RBAC): Certain endpoints are restricted based on the role of the user. For example, only 'buyers' can create new RFQs and only 'suppliers' can view all RFQs. This ensures that users can only perform actions that their role permits, providing a secure way to control resource access.
7) Cross-Origin Resource Sharing (CORS): CORS middleware is used to control which domains can communicate with the API. This prevents potential cross-domain attacks.
8) Express.js Error Handling: The application has a dedicated middleware for error handling. This helps to catch and handle errors that may occur during the execution of request handling code, preventing unwanted exposure of sensitive information and providing useful feedback to the user.
9) MongoDB Connection Security: The MongoDB connection uses the useNewUrlParser and useUnifiedTopology options to ensure the connection uses the latest connection management engine from MongoDB and handles topology changes correctly.
10) HTTP Headers and Body Parsing: The application makes use of body-parser to handle JSON payloads. This helps in mitigating certain types of HTTP Header Injection attacks.

### How to use (Buyer)

1) Login in with the given credentials in the "Log In" tab in the header, (this will also be the default landing page). At the moment buyers have to be manually added since this was designed for a single buyer to use. Enter "buyer" into the Company Name and the given password in the password field and click the "Login" button. Where you will be greeted by the welcome page.
2) To create a new Request for Quotation (RFQ) navigate to the "New RFQ" tab in the header. Fill out the details in the form and hit the "Release RFQ" button to publish it for supplier review. If you need to clear lots of detail from the RFQ press the Clear Template button to remove all entries in the form.
3) To see all your RFQs that have been published navigate to the "Outstanding RFQs" tab in the header.
4) To view the supplier responses to that RFQ click the "View" button.
5) In this screen you can edit the RFQ by clicking the "Edit RFQ" button. This will open up a form with the details of the RFQ. You can edit the contents of the RFQ in the form fields. To complete the changes hit the "Submit Changes" button. If you change the status to "Closed" this will prevent suppliers from making further submissions or amendments to their responses. If you have decided against making changes hit the "Cancel" button to close the editing form without making changes.
6) In the Responses section you change the status of the suppliers responses by clicking the "Change Response Status" button. If you change the response to "Accepted" this will prevent that supplier from making further amendments to their response.
7) Click the "Go back" button to be returned back to the "Outstanding RFQs" tab.
8) If you wish to Log out simply click "Log Out" in the header.

### How to use (Supplier)

1) Login with your company name and password by entering your details into the relevant fields and selecting the "Login" button.
2) If you do not have an account, navigate to the "Register" tab in the header where you should enter your company and set a password. Then hit the register button. If you receive an error message follow the instruction to correct. If you receive a "Registered successfully" message navigate back to the "Login" tab and follow step 1 to login.
3) Once you have successfully logged in you will be greeted with the Welcome page.
4) To see what RFQs are outstanding navigate to the "Respond to RFQs" tab by clicking on the header there. Here you will see what RFQs are outstanding and the status of your response.
5) To see the detail of an RFQ or submit a response to an RFQ click the "View" button.
6) Check the details of the RFQ. If the Status is "Closed" then you will not be able to make a response nor edit any previous responses.
7) If the RFQ status is "Open" and you haven't made a response yet. You can create a response by filling in the relevant fields in the response section and then selecting the "Submit Response". This will then be visible to the buyer.
8) If you have made a response already that hasn't been accepted and the RFQ is still open you can select the "Edit Response" button which will open up the same fields as when you created the response. Make the amendments in the fields and then select "Save" button to amend them or "Cancel" to cancel any changes.
9) Click the "Go back" button to be returned back to the "Outstanding RFQs" tab.
10) If you wish to Log out simply click "Log Out" in the header.