import React, { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { useDataMutation } from "@dhis2/app-runtime";
import { fetch_commodities, restock_post_request } from "../utils/queries";
import {
  InputField,
  SingleSelect,
  SingleSelectOption,
  Button,
} from "@dhis2/ui";
import classes from "./Restock.module.css";
import { AlertBar } from "@dhis2/ui";
import { mergeData } from "../utils/functions";

export function Restock() {
  const { loading, error, data } = useDataQuery(fetch_commodities);
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    if (data) {
      let mergedData = mergeData(data);
      mergedData = mergedData[0].commodities;
      setMergedData(mergedData); // Update mergedData when data is available
    }
  }, [data]);

  const today = new Date();
  const [date, setDate] = useState(today.toISOString().substring(0, 10)); //   default date today
  const [time, setTime] = useState(`${today.getHours()}:${today.getMinutes()}`);

  // Success and failure messages
  const [noCom, setNoCom] = useState([]);
  const [hiddenSuccess, setHiddenSuccess] = useState(true);
  const [hiddenFailure, setHiddenFailure] = useState(true);
  const [warnAlert, setWarnAlert] = useState("");

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function pauseSuccess() {
    setHiddenSuccess(false);
    await delay(5000);
    setHiddenSuccess(true);
  }

  async function pauseFailure() {
    setHiddenFailure(false);
    await delay(5000);
    setHiddenFailure(true);
  }

  async function pauseWarnAlert(msg) {
    setWarnAlert(msg);
  }
  // Lines for adding commodities
  const [lines, setLines] = useState([
    {
      id: "",
      element: "",
      quantity: 0,
    },
  ]);
  // Adds a new object containing commoditiy and value to list of lines
  const addLine = () => {
    setLines([...lines, { id: "", element: "", quantity: 0 }]);
  };
  
  // Updates the value of each object in the lines list
  const updateLine = (index, field, value) => {
    const updatedLines = [...lines];
    if (field === "element") {
      const commodity = mergedData.find((item) => item.displayName === value);
      if (commodity) {
        updatedLines[index].id = commodity.id;
        updatedLines[index].element = value;
      }
    } else if (field === "quantity") {
      updatedLines[index].quantity = value;
    }
    setLines(updatedLines);
  };
  // Removes an object from the list of lines
  const removeLine = (index) => {
    const updatedLines = [...lines];
    updatedLines.splice(index, 1);
    setLines(updatedLines);
  };

  const [mutate, { loading2, error2 }] = useDataMutation(restock_post_request);
  // Function for Updating the API
  const post = async () => {
    // Check if there are no lines
    if (lines.length === 0) {
      pauseWarnAlert("Please add at least one commodity to dispense.");
      pauseFailure();
      return;
    }
    // Array to keep track of empty commodities
    const emptyComs = lines.map(() => false);
    // Flag for registration status
    let registered = true;

    // Check for empty commodities
    for (const [index, line] of lines.entries()) {
      if (!line.id || line.quantity === 0) {
        emptyComs[index] = true;
        registered = false;
      } else {
        // Perform restock only if all fields are filled
        const commodity = mergedData.find((item) => item.id === line.id);
        if (commodity) {
          const result = await mutate({
            id: line.id,
            quantity: parseInt(commodity.endBalance) + parseInt(line.quantity),
            period: date.substring(0, 7).replace(/-/g, ""),
          });
        }
      }
    }
    // Check for empty date and time
    const noDate = !date;
    const noTime = !time;

    setNoCom(emptyComs);

    // Display success or failure message
    if (
      registered &&
      !noDate &&
      !noTime &&
      !emptyComs.includes(true) &&
      !error2
    ) {
      // Reset form fields to default values
      setDate(today.toISOString().substring(0, 10));
      setTime(`${today.getHours()}:${today.getMinutes()}`);
      setLines([{ id: "", element: "", quantity: 0 }]);
      pauseSuccess();
    } else {
      pauseFailure();
    }
  };

  if (data) {
    // Return UI
    return (
      <div className={classes.alignCenter}>
        <h1>Restock Commodities</h1>

        <div className={classes.container}>
          <InputField
            className={classes.input}
            label="Date"
            name="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.value)}
          />
          <InputField
            className={classes.input}
            label="Time"
            name="time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.value)}
          />
        </div>

        <div className={classes.container}>
          {lines.map((line, index) => (
            <div key={index} className={classes.container}>
              <SingleSelect
                className={`${classes.commoditySelect} ${
                  noCom[index] ? classes.errorCommoditySelect : ""
                }`}
                placeholder="Select commodity"
                selected={line.element}
                error={noCom[index]}
                filterable
                noMatchText="No match found"
                onChange={(event) =>
                  updateLine(index, "element", event.selected)
                }
              >
                {mergedData.map((row) => (
                  <SingleSelectOption
                    label={row.displayName}
                    value={row.displayName}
                    key={row.id}
                    disabled={lines.some(
                      (item) => item.element === row.displayName
                    )}
                  />
                ))}
              </SingleSelect>
              <div className={classes.group}>
                <InputField
                  className={classes.quantityInput}
                  type="number"
                  placeholder="No. of packs"
                  min="1"
                  max="500" //Should be a realistic value
                  value={line.quantity.toString()} // Convert to string
                  onChange={(event) => {
                    const inputValue = parseInt(event.value, 10);
                    // Check if the entered value is less than 0
                    const isError = inputValue < 0;
                    updateLine(index, "quantity", isError ? 0 : inputValue);
                  }}
                />
                <Button
                  className={classes.removeBtn}
                  name="Remove_commodity"
                  onClick={() => removeLine(index)}
                  small
                  value="default"
                >
                  <svg
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm4 7a1 1 0 010 2H8a1 1 0 010-2z" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className={classes.container}>
          <Button
            className={classes.addCommodityBtn}
            name="Add_commodity"
            onClick={addLine}
            small
            value="default"
          >
            <svg
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v3h3a1 1 0 010 2h-3v3a1 1 0 01-2 0v-3H8a1 1 0 010-2h3V8a1 1 0 011-1z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </div>

        <Button
          className={classes.btn}
          name="Register"
          value="default"
          onClick={post}
        >
          Restock
        </Button>
        <React.Fragment key="0">
          <AlertBar className={classes.AlertBar} hidden={hiddenSuccess} success>
            Restock success: The stock balance has been updated
          </AlertBar>
        </React.Fragment>
        <React.Fragment key="1">
          <AlertBar
            className={classes.AlertBar}
            hidden={hiddenFailure}
            critical
          >
            Restock failed. Ensure all fields have valid input
          </AlertBar>
        </React.Fragment>
      </div>
    );
  }

  return null;
}
