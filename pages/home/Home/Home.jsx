import React from "react";
import { Helmet } from "react-helmet";
import NavBar from "./Navbar";

function Home() {
  return (
    <div>
      <Helmet>
        <title>myty - be present, searchable and discoverable</title>
      </Helmet>
      <NavBar />
    </div>
  );
}

export default Home;
