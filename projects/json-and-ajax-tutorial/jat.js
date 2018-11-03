var pageCounter = 1;

function getInfo() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://john-web-2018.azurewebsites.net/projects/json-and-ajax-tutorial/animals-' + pageCounter + '.json');
    ourRequest.onload = function() {
      if (ourRequest.status >= 200 && ourRequest.status < 400) {
        var ourData = JSON.parse(ourRequest.responseText);
        renderHTML(ourData);
      } else {
        console.log("We connected to the server, but it returned an error.");
      }
      
    };
  
    ourRequest.onerror = function() {
      console.log("Connection error");
    };
  
    ourRequest.send();
    pageCounter++;
    if (pageCounter > 3) {
      btn.classList.add("hide-me");
    }
}

function renderHTML(data) {
  var htmlString = "";
  var animalContainer = document.getElementById("animal-info");

  for (i = 0; i < data.length; i++) {
    htmlString += "<p>" + data[i].name + " is a " + data[i].species + " that likes ";
    
    for (ii = 0; ii < data[i].foods.likes.length; ii++) {
      if (ii == 0) {
        htmlString += data[i].foods.likes[ii];
      } else {
        htmlString += " and " + data[i].foods.likes[ii];
      }
    }

    htmlString += ' and dislikes ';

    for (ii = 0; ii < data[i].foods.dislikes.length; ii++) {
      if (ii == 0) {
        htmlString += data[i].foods.dislikes[ii];
      } else {
        htmlString += " and " + data[i].foods.dislikes[ii];
      }
    }

    htmlString += '.</p>';

  }

  animalContainer.insertAdjacentHTML('beforeend', htmlString);
}