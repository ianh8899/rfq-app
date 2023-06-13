//pages/_app.js
import React from "react"; // React library
import Navbar from "../components/Navbar"; // Navbar component for the application's navigation
import { AuthWrapper } from "../contexts/AuthContext"; // AuthWrapper context to provide authentication state and functions throughout the app
import Head from "next/head"; // Used to update the head section of the web page

function MyApp({ Component, pageProps, user }) {
  return (
    // AuthWrapper is a context provider for authentication
    // It receives user data as a prop and provides an authentication context
    // This means that any nested components can access authentication-related functions and data
    <AuthWrapper user={user}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx global>{`
         {
          /* Inline CSS in JSX for use across the app */
        }
        body {
          background-color: #414040;
          color: #ffffff;
          font-family: "Roboto", sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
      `}</style>
      <div className="container">
        {" "}
        {/*Wrapping our application inside the .container class for layout control*/}
        {/*Including the Navbar component. This component is displayed on every page because it is included here in _app.js*/}
        <Navbar />
        {/*Component is the page itself. Every time you navigate between routes, Next.js uses the Component prop passed to _app to automatically handle page transitions
                  PageProps is an object with the initial props for the page, fetched before rendering. It's spread into the component for convenience.*/}
        <Component {...pageProps} />
      </div>
    </AuthWrapper>
  );
}
export default MyApp;
