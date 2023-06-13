// pages/home.js
import React from "react"; // React library
import { useAuthContext } from "../contexts/AuthContext"; // Used for getting the current user data from AuthContext

// Home component definition
function Home() {
  // Accessing the AuthContext to get the user and setUser
  const { user, setUser } = useAuthContext();

  // Determine the type of the user, whether it's a 'buyer' or 'supplier'
  const userType = user ? (user.buyer ? "buyer" : "supplier") : null;

  return (
    <div>
      {" "}
      {/*If the user is a 'buyer', this section will be displayed*/}
      {userType === "buyer" && (
        <div>
          <h1>Welcome, Buyer!</h1>
          <p>
            Welcome to our RFQ management platform. You can create new RFQs,
            view outstanding RFQs and manage responses from suppliers.
          </p>
        </div>
      )}
      {/*If the user is a 'supplier', this section will be displayed*/}
      {userType === "supplier" && (
        <div>
          <h1>Welcome Supplier</h1>
          <p>
            Welcome to our RFQ management platform. You can view outstanding
            RFQs, submit responses and view statuses
          </p>
        </div>
      )}
    </div>
  );
}

// Export the component for use in _app.js
export default Home;
