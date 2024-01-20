import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import classes from "./Commodities.module.css";

// Sandbox mode of commodities
const TutorialCommodities = ({ tutorialData: tutorialData }) => {
  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: classes.alignCenter,
    },
    /*#__PURE__*/ React.createElement(
      "div",
      {
        className: classes.container,
      },
      /*#__PURE__*/ React.createElement("h1", null, "Commodities"),
      /*#__PURE__*/ React.createElement(
        Table,
        null,
        /*#__PURE__*/ React.createElement(
          TableHead,
          null,
          /*#__PURE__*/ React.createElement(
            TableRowHead,
            null,
            /*#__PURE__*/ React.createElement(
              TableCellHead,
              null,
              "Display Name"
            ),
            /*#__PURE__*/ React.createElement(
              TableCellHead,
              null,
              "End Balance"
            ),
            /*#__PURE__*/ React.createElement(
              TableCellHead,
              null,
              "Consumption"
            ),
            /*#__PURE__*/ React.createElement(
              TableCellHead,
              null,
              "To Be Ordered"
            ),
            /*#__PURE__*/ React.createElement(TableCellHead, null, "ID")
          )
        ),
        /*#__PURE__*/ React.createElement(
          TableBody,
          null,
          tutorialData.map((row) => {
            return /*#__PURE__*/ React.createElement(
              TableRow,
              {
                key: row.id,
              },
              /*#__PURE__*/ React.createElement(
                TableCell,
                null,
                row.displayName
              ),
              /*#__PURE__*/ React.createElement(
                TableCell,
                null,
                row.endBalance
              ),
              /*#__PURE__*/ React.createElement(
                TableCell,
                null,
                row.consumption
              ),
              /*#__PURE__*/ React.createElement(
                TableCell,
                null,
                row.quantityToBeOrdered
              ),
              /*#__PURE__*/ React.createElement(TableCell, null, row.id)
            );
          })
        )
      )
    )
  );
};

export default TutorialCommodities;
