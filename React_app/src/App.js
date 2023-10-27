import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./Table.js";
// import "./fontawesome.js";
// import "./solid.js";


function App() {
  /* Create state:
        - apiData: List containing dictionaries of countries from API.
        - searchQuery: The query parameter that should be added to &search=
        - pageNumber: The page that is requested
  */

  
  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(); // Default = No search query
  const [pageNumber, setPageNumber] = useState(1); //Default = Page 1
  const [pageSize, setPageSize] = useState(10); //Default = Page 10
  const [conti, setConti] = useState(["Asia", "Africa", "Europe", "Oceania", "North America", "South America"]);
  const [value, setValue] = useState(''); //Default = Page 1
  const [sortCol, setSortCol] = useState(["Country", "ASC"]);

  const search = (searchValue) => {
    setSearchQuery(searchValue);
  }

  useEffect(() => {
    // All parameters are appended to this URL.
    let apiQuery = "https://dhis2-app-course.ifi.uio.no/api?";

    // If searchQuery isn't empty add &search=searchQuery to the API request.
    if (searchQuery) {
      apiQuery = apiQuery + "&search=" + searchQuery;
    }

    // Add what page we are requesting to the API request.
    apiQuery = apiQuery + "&page=" + pageNumber;

    // Step 3: Add pagesize we are requesting to the API request.
    apiQuery = apiQuery + "&pageSize=" + pageSize;

    // Step 6: Add checkboxes
    apiQuery = apiQuery + "&Continent=" + conti.join(","); // Join selected continents

    apiQuery = apiQuery + "&order=" + sortCol.join(":");

    // Query data from API.
    console.log("Querying: " + apiQuery);
    fetch(apiQuery)
      .then((results) => results.json())
      .then((data) => {
        // Then add response to state.
        setApiData(data);
      });
  }, [searchQuery, pageNumber, pageSize, conti, sortCol]); // Array containing which state changes that should re-reun useEffect()
  
  const handleCheckbox = (continent) => {
    // Check if the continent is already in the list, and toggle its presence accordingly
    if (conti.includes(continent)) {
      setConti(conti.filter(item => item !== continent));
    } else {
      setConti([...conti, continent]);
    }
  };

  return (
    <div className="App">
      <h1>Country lookup</h1>
      {/* Step 2 */}   
      <span class="refresh" onClick={() => window.location.reload()}>&#8635;</span>   
      <input type="text" value={value} id="search" name="search" placeholder="Search" onChange={(event) => setValue(event.target.value)} ></input>
      <button id="addButton" type = "button" onClick = {() => search(value)} >Search</button>
      <br></br>
      <label><input type="checkbox" checked={conti.includes("Asia")} id="Asia" onChange={() => handleCheckbox("Asia")}></input>Asia</label>
      <label><input type="checkbox" checked={conti.includes("Africa")} id="Africa" onChange={() => handleCheckbox("Africa")}></input>Africa</label>
      <label><input type="checkbox" checked={conti.includes("Europe")} id="Europe" onChange={() => handleCheckbox("Europe")}></input>Europe</label>
      <label><input type="checkbox" checked={conti.includes("Oceania")} id="Oceania" onChange={() => handleCheckbox("Oceania")}></input>Oceania</label>
      <label><input type="checkbox" checked={conti.includes("North America")} id="NorthAmerica" onChange={() => handleCheckbox("North America")}></input>North America</label>
      <label><input type="checkbox" checked={conti.includes("South America")} id="SouthAmerica" onChange={() => handleCheckbox("South America")}></input>South America</label>
      <Table apiData={apiData} sortCol={sortCol} setSortCol={setSortCol} />
      
      {/* Step 3 */}
      <div class="pageControl">
        <label for="paging">Show only: </label>
        <select id="paging" type="dropdown" onChange={(event) => {setPageSize(event.target.value); setPageNumber(1)}}>
          <option value="10" selected>10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
        </select><br></br>
        {/* Step 4 */}
        <span>{pageNumber} of {Math.ceil(215/pageSize)}</span>
        <button class="arrow" onClick= {() => setPageNumber(pageNumber-1)} hidden={pageNumber === 1}>&#8249;</button>
        <button class="arrow" onClick= {() => setPageNumber(pageNumber+1)} hidden={pageNumber === Math.ceil(215/pageSize)}>&#8250;</button>
      </div>
    </div>
  );
  
}

export default App;
