import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from "@dhis2/ui";
import classes from "./Statistics.module.css";
import { mergeData } from "../utils/functions";
import { fetch_commodities } from "../utils/queries";
import { Line, Bar } from "react-chartjs-2";

export function Statistics() {
  const lst = [];

  const { loading, error, data } = useDataQuery(fetch_commodities);
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  if (data) {
    const mergedData = mergeData(data);
    console.log("API response:", mergedData);
    // Creates a list containing dictionaires for every commodity
    lst.push(
      mergedData[0].commodities.map((com) => ({ 
        name: com.displayName, 
        consumed: com.consumption,
        balance: com.endBalance,
        order: com.quantityToBeOrdered,
      }))
    );
  }
  // Maps the data for the bar chart
  const [chartData2, setChartData2] = useState({
    labels: lst[0].map((data) => data.name),
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
    datasets: [
      {
        label: "Commodity consumption",
        data: lst[0].map((data) => data.consumed),
        backgroundColor: ["#90caf9"],
        borderColor: "black",
        borderWidth: 1,
      },
      {
        label: "Commodity end balance",
        data: lst[0].map((data) => data.balance),
        backgroundColor: ["#4db6ac"],
        borderColor: "black",
        borderWidth: 1,
        hidden: true,
      },
      {
        label: "Commodities to be ordered",
        data: lst[0].map((data) => data.order),
        backgroundColor: ["#ffc324"],
        borderColor: "black",
        borderWidth: 1,
        hidden: true,
      },
    ],
  });
  // Return UI
  return (
    <div className={classes.alignCenter}>
      <div>
        <h1>Statistics</h1>
      </div>

      {/*Bar plot*/}
      <div className={classes.chartContainer}>
      <Bar data={chartData2} className={classes.barChart} />
      </div>
      <div className={classes.commoditiesContainer}>
        <h1>Commodities</h1>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Display Name</TableCellHead>
              <TableCellHead>End Balance</TableCellHead>
              <TableCellHead>Consumption</TableCellHead>
              <TableCellHead>To Be Ordered</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {mergeData(data)[0].commodities.map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell>{row.endBalance}</TableCell>
                  <TableCell>{row.consumption}</TableCell>
                  <TableCell>{row.quantityToBeOrdered}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
