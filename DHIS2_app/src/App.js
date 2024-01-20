import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Navigation } from "./components/Navigation";
import { Dispense } from "./components/Dispense";
import { Restock } from "./components/Restock";
import { Statistics } from "./components/Statistics";
import { Tutorial } from "./components/Tutorial";

function MyApp() {
  const [activePage, setActivePage] = useState("Dispense");

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.bottom}>
        {activePage === "Dispense" && <Dispense />}
        {activePage === "Restock" && <Restock />}
        {activePage === "Statistics" && <Statistics />}
        {activePage === "Tutorial" && <Tutorial />}
      </div>
    </div>
  );
}

export default MyApp;
