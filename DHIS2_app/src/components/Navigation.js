import React from "react";
import { Tab, TabBar } from "@dhis2/ui";
import "./Navigation.css";

export function Navigation(props) {
  return (
    <div className="navigation">
      <TabBar>
        <Tab
          className="tab"
          selected={props.activePage === "Dispense"}
          onClick={() => props.activePageHandler("Dispense")}
        >
          Dispense
        </Tab>
        <Tab
          className="tab"
          selected={props.activePage === "Restock"}
          onClick={() => props.activePageHandler("Restock")}
        >
          Restock
        </Tab>
        <Tab
          className="tab"
          selected={props.activePage === "Statistics"}
          onClick={() => props.activePageHandler("Statistics")}
        >
          Statistics
        </Tab>
        <Tab
          className="tab"
          selected={props.activePage === "Tutorial"}
          onClick={() => props.activePageHandler("Tutorial")}
        >
          Tutorial
        </Tab>
      </TabBar>
    </div>
  );
}
