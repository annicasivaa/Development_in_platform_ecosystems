console.log("Running program.")

// Task 1-2 (changed after task 5-6)
function addCountry(name, initialPop, finalPop, countrate) {
  const inp = document.querySelector("#addCountry");
  const list = document.querySelector("#countryList");

  // Create a new list item
  const newLi = document.createElement("li");
  newLi.textContent = `${name} - ${numeral(initialPop).format('0, 0')} `;

  // Create icon
  const button = document.createElement("button");
  button.type = "button";  
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-trash";
  button.appendChild(icon)
  newLi.appendChild(button)

  // Ticking population counter 
  let population = parseInt(initialPop)
  const incrementPop = () => {
    population = population +  countrate
    const pop = numeral(Math.round(population)).format('0, 0');  // formated and rounded
    newLi.textContent = `${name} - ${pop} `
    newLi.appendChild(button)
  }
  const populationInterval = setInterval(incrementPop, 1000);

  // Renew the input content
  inp.value = "";

  list.appendChild(newLi)
  button.addEventListener("click", function() {
    clearInterval(populationInterval); // stop the pop increase interval
    list.removeChild(newLi);
  });
}

// Task 3
function matchWords(element, searchWord) {
  return element.startsWith(searchWord)
}

function matchWordsInList(list, searchWord) {
  return list.filter(word => matchWords(word.toLowerCase(), searchWord.toLowerCase()))
}

// Example
newList = matchWordsInList(["India",
"Norway",
"Denmark",
"Sweden",
"Indonesia"],
"Ind") // search word
console.log("Here is the list of matching words with 'Ind': ", newList)

// Task 4
function match(searchValue) {
  // Extract the updated list
  const countries = document.querySelector('#countryList').getElementsByTagName('li');
  
  console.log(searchValue)
  for (const country of countries) {
    if (!matchWords(country.textContent, searchValue)) {
      console.log("Hide ", country.textContent)
      country.hidden = "hidden"
    } else {
      country.removeAttribute("hidden");
      console.log("Show ", country.textContent)
    }
  }
}

//Task 5 (optional)

const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function checkCountry() {
  let countryName = document.querySelector("#addCountry").value;
  const url = `https://d6wn6bmjj722w.population.io/1.0/population/${countryName}/today-and-tomorrow/`
  
  // Getting api and then sending the data into addCountry function
  fetch(url)
    .catch(handleErrors)
    .then(response => response.json())
    .then(data => {
      if (data.total_population) {
        initialPop = JSON.stringify(data.total_population[0].population)
        finalPop = JSON.stringify(data.total_population[1].population)
        countrate = (finalPop-initialPop)/86400  //divide upon sec in a day
        addCountry(countryName, initialPop, finalPop, countrate)
      }
      else {
        console.log("Invalid input!")
        window.alert("Invalid input!")
        return
      }
    })
}


