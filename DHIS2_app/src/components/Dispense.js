import React, { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { useDataMutation } from "@dhis2/app-runtime";
import {
  InputField,
  SingleSelect,
  SingleSelectOption,
  Button,
} from "@dhis2/ui";
import classes from "./Dispense.module.css";
import { AlertBar } from "@dhis2/ui";
import {
  Table,
  TableBody,
  TableCellHead,
  TableHead,
  TableRowHead,
} from "@dhis2/ui";
import { dispense_post_request, fetch_commodities } from "../utils/queries.js";
import { mergeData } from "../utils/functions.js";

export function Dispense() {
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
  const [dispBy, setDispBy] = useState("");
  const [dispTo, setDispTo] = useState("");
  const [date, setDate] = useState(today.toISOString().substring(0, 10)); //   default date today
  const [time, setTime] = useState(`${today.getHours()}:${today.getMinutes()}`);

  // Lines of adding commodities
  const [lines, setLines] = useState([
    {
      id: "",
      element: "",
      quantity: 0,
    },
  ]);
  
  // Adds a new object containing commodity and and value to list of lines
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

  // Success and failure messages
  const [noCom, setNoCom] = useState([]);
  const [noDispBy, setNoDispBy] = useState(false);
  const [noDispTo, setNoDispTo] = useState(false);
  const [hiddenSuccess, setHiddenSuccess] = useState(true);
  const [hiddenFailure, setHiddenFailure] = useState(true);
  const [warnAlert, setWarnAlert] = useState("");

  // Creates a delay for the alert bars
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
  
  // Creates useDataMutation variable 
  const [mutate, { loading2, error2 }] = useDataMutation(dispense_post_request);
  
  // Function that posts to the API
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

    for (const [index, line] of lines.entries()) {
      // Finds the commodity based on ID
      const commodity = mergedData.find((item) => item.id === line.id);

      if (commodity) {
        if (Number(line.quantity) > Number(commodity.endBalance)) {
          pauseWarnAlert(
            `You are trying to dispense more than available in-stock (${commodity.endBalance})`
          );
          pauseFailure();
        } else {
          const result = await mutate({
            id: line.id,
            quantity: parseInt(commodity.endBalance) - parseInt(line.quantity),
            consumption:
              parseInt(commodity.consumption) + parseInt(line.quantity),
            period: date.substring(0, 7).replace(/-/g, ""),
          });

          /*
          // Updates history in Datastore
          dataObject.Consumption = parseInt(dataObject.Consumption) + parseInt(line.quantity)
          
          dataObject.history.push(
            {
              dispBy: dispBy,
              dispTo: dispTo,
              date: date,
              commodity: commodity.displayName,
              amount: line.quantity,
            }
          )
          */
        }
      } else {
        registered = false;
        // If no commodity is found in line i, mark as empty
        emptyComs[index] = true;
      }
    }
    // Status messages for empty fields
    setNoCom(emptyComs);
    setNoDispBy(!dispBy);
    setNoDispTo(!dispTo);

    if (registered && dispBy && dispTo) {
      pauseSuccess();
    } else {
      pauseFailure();
    }
  };

  // Function to get the endBalance value for a specific id
  const getEndBalance = (id) => {
    // Search for the commodity in mergedData
    const commodity = mergedData.find((item) => item.id === id);
    if (commodity) {
      return commodity.endBalance;
    }
    // If the commodity is not found, return error
    return null;
  };

  if (data) {
    // return UI
    return (
      <div className={classes.alignCenter}>
        <h1>Dispense Commodities</h1>

        <div className={classes.container}>
          <InputField
            error={noDispBy}
            className={`${classes.input} ${
              noDispBy ? classes.errorBorder : ""
            }`}
            label="Dispensed by"
            placeholder="Name"
            name="dispensedBy"
            type="text"
            value={dispBy}
            onChange={(event) => setDispBy(event.value)}
          />
          <InputField
            error={noDispTo}
            className={`${classes.input} ${
              noDispBy ? classes.errorBorder : ""
            }`}
            label="Dispensed to"
            placeholder="Name"
            name="dispensedTo"
            type="text"
            value={dispTo}
            onChange={(event) => setDispTo(event.value)}
          />
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
                error={noCom[index]}
                validationText="Please choose a commodity."
                className={`${classes.commoditySelect} ${
                  noCom[index] ? classes.errorCommoditySelect : ""
                }`}
                placeholder="Select commodity"
                selected={line.element}
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
                  className={classes.endBalanceField}
                  label="Current balance"
                  name="endBalanceField"
                  readOnly
                  value={getEndBalance(line.id, mergedData)}
                />

                <InputField
                  className={classes.quantityInput}
                  label="To be dispensed"
                  type="number"
                  placeholder="No. of packs"
                  min="1"
                  max="500" //This should be evaluated according to normal consumtion
                  value={line.quantity.toString()} // Convert to string
                  onChange={(event) => {
                    const inputValue = parseInt(event.value, 10);
                    // Check if the entered value is less than 0
                    const isError = inputValue < 0;
                    updateLine(index, "quantity", isError ? 0 : inputValue);
                  }}
                  error={
                    Number(line.quantity) >
                    Number(getEndBalance(line.id, mergedData))
                  }
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
          Dispense
        </Button>

        <React.Fragment key="0">
          <AlertBar className={classes.AlertBar} hidden={hiddenSuccess} success>
            Dispense success! The stock balance has been updated
          </AlertBar>
        </React.Fragment>
        <React.Fragment key="1">
          {warnAlert && (
            <AlertBar
              className={classes.AlertBar}
              permanent={warnAlert}
              warning
              onClose={() => setWarnAlert("")}
            >
              {warnAlert}
            </AlertBar>
          )}
        </React.Fragment>
        <React.Fragment key="1">
          <AlertBar
            className={classes.AlertBar}
            hidden={hiddenFailure}
            critical
          >
            Dispense failed. Ensure all fields have valid input
          </AlertBar>
        </React.Fragment>

        <h3>Recent transactions</h3>
        <div className={classes.alignCenter}>
          <div className={classes.container}>
            <Table>
              <TableHead>
                <TableRowHead>
                  <TableCellHead>Dispensed By</TableCellHead>
                  <TableCellHead>Dispensed To</TableCellHead>
                  <TableCellHead>Date and time</TableCellHead>
                  <TableCellHead>Commodity</TableCellHead>
                  <TableCellHead>Amount</TableCellHead>
                </TableRowHead>
              </TableHead>
              <TableBody>
                {/*
              {dataObject.history.reverse().slice(0,5).map((element) => {
                return (
                  <TableRow>
                    <TableCell>{element.dispBy}</TableCell>
                    <TableCell>{element.dispTo}</TableCell>
                    <TableCell>{element.date}</TableCell>
                    <TableCell>{element.commodity}</TableCell>
                    <TableCell>{element.amount}</TableCell>
                  </TableRow>
                );
              })}*/}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
