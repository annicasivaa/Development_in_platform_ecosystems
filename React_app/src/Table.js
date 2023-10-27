import { useState, useEffect } from "react";

function Table(props) {
  console.log(props.apiData);
  
  if (!props.apiData.results) {
    // If the API request isn't completed return "loading...""
    return <p>Loading...</p>;
  } else {
    // Write your code here:

    function setSort(col) {
      //props.setSortCol([col, "ASC" ? "DESC" : "ASC"]);
      const newSortOrder = props.sortCol[1] === "ASC" ? "DESC" : "ASC";
      props.setSortCol([col, newSortOrder]);
    }
    
    return <table>
      <thead>
        <tr>
          <th onClick={() => setSort("Country")}>Country</th>
          <th onClick={() => setSort("Continent")}>Continent</th>
          <th onClick={() => setSort("Population")}>Population</th>
          <th onClick={() => setSort("PopulationGrowth")}>Population Growth</th>
        </tr>
      </thead>
      <tbody>
        {props.apiData.results.map((res, index) => (
          <tr key={index}>
          <td id="country">{res.Country}</td>
          <td id="continent">{res.Continent}</td>
          <td id="pop">{res.Population}</td>
          <td id="pop_gro">{res.PopulationGrowth}</td>
        </tr>
        ))}
      </tbody>
      
    </table>;
  
  }
}

export default Table;