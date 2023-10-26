//components/Navbar.js
import Link from "next/link";
import { useAuthContext } from "../contexts/AuthContext"; // Used for getting the current user data from AuthContext
import { useRouter } from "next/router"; // Used for handling routing within the app
import React from "react"; // React library
import Head from "next/head";
import axios from "axios"; // Used to update the head section of the web page

// Navbar functional component definition
const Navbar = () => {
  const { user, setUser } = useAuthContext(); // Getting the current user and setUser function from the AuthContext
  const userType = user ? (user.buyer ? "buyer" : "supplier") : null; // Checking if user exists, if so, determining their type
  const router = useRouter(); // Creating a router instance

  // Function to handle logout operation
  // Function to handle logout operation
  const handleLogout = () => {
    // Send a request to the server-side logout route
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`, {}, { withCredentials: true })
      .then((response) => {
        // Clear the user data from the React state
        setUser(null);
        // Redirect the user to the root route ('/')
        router.push("/");
      })
      .catch((error) => {
        console.error("Logout failed: ", error);
      });
  };

  // Function to apply different styles to the navigation link based on the current path
  const linkStyle = (path) => ({
    backgroundColor: router.pathname === path ? "#000" : "transparent",
    color: router.pathname === path ? "#FFF" : "#DDD",
  });

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <nav>
        {/* Inline CSS in JSX */}
        <style jsx>{`
          nav {
            background-color: #333;
            color: #ddd;
            padding: 0px;
            font-family: "Roboto", sans-serif;
            line-height: 1.6;
          }
          span {
            display: inline-block;
            padding: 20px 50px;
            margin-right: 10px;
            cursor: pointer;
          }
          a {
            color: inherit;
            text-decoration: none;
            display: inline-block;
            height: 100%;
            width: 100%;
          }
          span:hover {
            color: #fff;
          }
        `}</style>
        {/* If no user is logged in, show Login and Register links */}
        {!userType && (
          <div>
            <span style={linkStyle("/")}>
              <Link href="/">Login</Link>
            </span>
            <span style={linkStyle("/register")}>
              <Link href="/register">Register</Link>
            </span>
          </div>
        )}
        {/* If logged-in user is a buyer, show links specific to buyer */}
        {userType === "buyer" && (
          <div>
            <span style={linkStyle("/home")}>
              <Link href="/home">Home</Link>
            </span>
            <span style={linkStyle("/newrfq")}>
              <Link href="/newrfq">New RFQ</Link>
            </span>
            <span style={linkStyle("/outstandingrfqs")}>
              <Link href="/outstandingrfqs">Outstanding RFQs</Link>
            </span>
            <span onClick={handleLogout}>Log Out</span>
          </div>
        )}
        {/* If logged-in user is a supplier, show links specific to supplier */}
        {userType === "supplier" && (
          <div>
            <span style={linkStyle("/home")}>
              <Link href="/home">Home</Link>
            </span>
            <span style={linkStyle("/rfqsforresponse")}>
              <Link href="/rfqsforresponse">Respond to RFQs</Link>
            </span>
            <span onClick={handleLogout}>Log Out</span>
          </div>
        )}
      </nav>
    </>
  );
};
// Export Navbar so it can be used in the rest of the application
export default Navbar;
