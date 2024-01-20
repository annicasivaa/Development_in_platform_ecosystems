import { useState, useEffect } from "react";

import { Tab, TabBar, SegmentedControl, Button } from "@dhis2/ui";
import TutorialCommodities from "./TutorialCommodities";
import TutorialRestock from "./TutorialRestock";
import TutorialDispense from "./TutorialDispense";
import classes from "./Tutorial.module.css";

const instructions = {
  Commodities:
    "This table provides an overview of all commodities tracked in the store. It includes the current end balance, month-to-date consumption, and the recommended quantity that should be ordered of each commodity in the upcoming month.",
  Dispense:
    "This form is utilized for dispensing commodities to customers. Your name, the customer's name as well as the time and date are entered for logging purposes. Time and date are automatically set to the current moment but can be adjusted if needed, such as in the case of a power outage or Internet downtime. The next step involves selecting the commodities. While this is typically determined by the customer, you will have the final say on whether there are sufficient items in stock to fulfill the customer's request. The current stock quantity for a chosen commodity is visible in the field next to the commodity, and it's not possible to dispense more than what is available in stock. Upon pressing the \"Dispense\" button, the form is submitted, and the system updates the values for each selected commodity. An error will occur if any of the fields are left blank. You may confirm the outcome by reviewing the Commodities page.",
  Restock:
    'This form is utilized whenever the store receives new stock. It is crucial to promptly register incoming stock upon its arrival to ensure accurate system records. Delayed registration may result in stock being dispensed before updating the system, leading to discrepancies. Enter your name in the designated field and confirm the accuracy of the time and date of when the restock happened. This is go ensure correct logging history. Then, select the commodities to be restocked, specifying the quantity of packs each will receive. Upon pressing the "Restock" button, the new stock balance is updated with the added stock for each commodity. An error will occur if any fields are left blank. You may confirm the outcome by reviewing the Commodities page.',
};

export function Tutorial() {
  const [tutorialMode, setTutorialMode] = useState(false);

  const [tutorialData, setTutorialData] = useState([
    {
      id: "0",
      displayName: "Commodities - 1",
      endBalance: "23",
      consumption: "3",
      quantityToBeOrdered: "12",
    },
    {
      id: "1",
      displayName: "Commodities - 2",
      endBalance: "32",
      consumption: "3",
      quantityToBeOrdered: "112",
    },
  ]);

  const handleTutorialDataUpdate = (id, newQuantity, newConsumption) => {
    setTutorialData((prevData) => [
      ...prevData.slice(0, id),
      {
        ...prevData[id],
        endBalance: newQuantity,
        consumption: newConsumption,
      },
      ...prevData.slice(id + 1),
    ]);
  };

  const [option, setOption] = useState("Commodities");

  const handleOptionChange = (value) => {
    setOption(value);
  };

  const startTutorial = () => {
    setTutorialMode(true);
  };

  useEffect(() => {
    return () => {
      // Cleanup function, executed when the component is unmounted
      setTutorialMode(false);
    };
  }, []);

  return (
    <div className={classes.alignCenter}>
      <>
        {!tutorialMode ? ( // Display the button if the tutorial has not started
          <>
            <h1>Tutorial</h1>
            <div className={classes.intro}>
              <p>
                Welcome to the tutorial!
                <br />
                By clicking the start button you will enter tutorial mode,
                allowing you to explore the system's functionalities.
                <br />
                Note that no information registered in the tutorial is sent to
                the database and all values will reset once you leave.
                <br />
              </p>
            </div>
            <Button className={classes.btn} onClick={startTutorial}>
              Start Tutorial
            </Button>
          </>
        ) : (
          <>
            <div>
              <h1>Tutorial</h1>
              <div className={classes.tutorialContainer}>
                <TabBar>
                  <Tab
                    className={classes.tab}
                    onClick={() => handleOptionChange("Commodities")}
                    selected={option === "Commodities"}
                  >
                    Commodities
                  </Tab>
                  <Tab
                    className={classes.tab}
                    onClick={() => handleOptionChange("Dispense")}
                    selected={option === "Dispense"}
                  >
                    Dispense
                  </Tab>
                  <Tab
                    className={classes.tab}
                    onClick={() => handleOptionChange("Restock")}
                    selected={option === "Restock"}
                  >
                    Restock
                  </Tab>
                </TabBar>
                <div className={classes.description}>
                  <div>{instructions[option]}</div>
                </div>
                <div>
                  {option === "Commodities" && (
                    <TutorialCommodities tutorialData={tutorialData} />
                  )}
                  {option === "Dispense" && (
                    <TutorialDispense
                      tutorialData={tutorialData}
                      onUpdateTutorialData={handleTutorialDataUpdate}
                    />
                  )}
                  {option === "Restock" && (
                    <TutorialRestock
                      tutorialData={tutorialData}
                      onUpdateTutorialData={handleTutorialDataUpdate}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
}
