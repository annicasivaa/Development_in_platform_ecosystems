import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { fetch_commodities } from "../utils/queries";
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
import { mergeData } from "../utils/functions.js";

export function Commodities() {
  const { loading, error, data } = useDataQuery(fetch_commodities);
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    let mergedData = mergeData(data);
    console.log(mergedData[0].commodities);
    const m = Date().toLocaleString("default", { month: "long" });
    const date = new Date().toISOString().substring(0, 7);

    return (
      <div className={classes.alignCenter}>
        <div className={classes.container}>
          <h1>Commodities</h1>
          <h3>{date}</h3>
          <Table>
            <TableHead>
              <TableRowHead>
                <TableCellHead>Display Name</TableCellHead>
                <TableCellHead>End Balance</TableCellHead>
                <TableCellHead>Consumption</TableCellHead>
                <TableCellHead>To Be Ordered</TableCellHead>
                <TableCellHead>ID</TableCellHead>
              </TableRowHead>
            </TableHead>
            <TableBody>
              {mergedData[0].commodities.map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell>{row.displayName}</TableCell>
                    <TableCell>{row.endBalance}</TableCell>
                    <TableCell>{row.consumption}</TableCell>
                    <TableCell>{row.quantityToBeOrdered}</TableCell>
                    <TableCell>{row.id}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.alignCenter}>
      <div className={classes.container}>
        <h1>Commodities</h1>
      </div>
    </div>
  );
}
