var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;

function initApplication() {
    console.log('Mustang v3 - Starting!'); 
    loadIndex();
}

function storeJSON() {
    var tempJSON = JSON.stringify(contactArray);
    tempJSON = JSON.parse(tempJSON);
    if (contactArray.length) // If contacts
    {
        $.ajax({
            type: "POST",
            url: "write-to-json.php",
            data: {
                json: JSON.stringify(tempJSON)
            }
        })
        document.getElementById("status").innerHTML = "< " + "STORED TO SERVER" + " >";
    }
}

function loadJSON(){
    $.getJSON("contact_data.json", function(json) {
        contactArray = json;
        deleteAllCards();
        reloadCards();
    });
    document.getElementById("status").innerHTML = "< " + "LOADED FROM SERVER" + " >";
}

function loadIndex() {
    // Load the Mustang index file.
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i=0; i<contactIndex.length; i++) {
            contactURLArray.push(contactIndex[i].ContactURL);
        }
    }
    indexRequest.send();
}

function loadContacts() {
    var loadButton = document.getElementById("loadButton");
    loadButton.parentNode.removeChild(loadButton);

    // Clear the current contactArray.
    contactArray.length = 0;

    document.getElementById("status").innerHTML = "<";

    if (contactURLArray.length > loadingContact) {
        loadContactAt(loadingContact);
    }
}

function loadContactAt(i)
{
    if (loadingContact == (contactURLArray.length-1))
    {
        var html = "";
        for (i = 0; i < (contactURLArray.length/2) - 8; i++)
        {
            html += "| ";
        }
        document.getElementById("status").innerHTML = "<" + html + "LOADING COMPLETE " + html + ">";
        setTimeout(function(){
            addCreateCardToEnd();
        }, 500);
    }
    else
    {
        document.getElementById("status").innerHTML += "| ";
    }
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', contactURLArray[i]);

    contactRequest.onload = function() {
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        contactArray.push(contact);
        var html = [
        '<div id="card-'+loadingContact+'" class="col-md-3 col-sm-6">',
            '<div class="card h-100" data-toggle="modal" data-target="#the-one-modal" onclick="loadCard('+loadingContact+')">',
                '<div class="card-body">',
                    '<div id="card-pref-name-'+loadingContact+'">'+ contact.preferredName +'</div><br>',
                    '<div id="card-full-name-'+loadingContact+'">'+ contact.lastName + ', ' + contact.firstName + '</div><br>',
                    '<div id="card-email-'+loadingContact+'">'+ contact.email +'</div><br>',
                    '<div id="card-phone-number-'+loadingContact+'">' + contact.phoneNumber + '</div>',
                '</div>',
            '</div>',
        '</div>'
        ].join('');

        document.getElementById("insertingRow").innerHTML += html;

        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadContactAt(loadingContact);
        }
    }
    // Useful for skipping JSON files that return CORS errors
    contactRequest.onerror = function() {
        contactArray.push(null);
        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadContactAt(loadingContact);
        }
    }
    contactRequest.send();
}

var currentCard;

function loadCard(number)
{
    currentCard = number;
    document.getElementById("info-modal-header").innerHTML = contactArray[number].preferredName;

    document.getElementById("info-first-name").value = contactArray[number].firstName;
    document.getElementById("info-last-name").value = contactArray[number].lastName;
    document.getElementById("info-preferred-name").value = contactArray[number].preferredName;
    document.getElementById("info-email").value = contactArray[number].email;
    document.getElementById("info-phone-number").value = contactArray[number].phoneNumber;
    document.getElementById("info-city").value = contactArray[number].city;
    document.getElementById("info-state").value = contactArray[number].state;
    document.getElementById("info-zip").value = contactArray[number].zip;
    document.getElementById("info-lat").value = contactArray[number].lat;
    document.getElementById("info-lng").value = contactArray[number].lng;
}

function saveChanges()
{
    // store changes
    contactArray[currentCard].firstName = document.getElementById("info-first-name").value;
    contactArray[currentCard].lastName = document.getElementById("info-last-name").value;
    contactArray[currentCard].preferredName = document.getElementById("info-preferred-name").value;
    contactArray[currentCard].email = document.getElementById("info-email").value;
    contactArray[currentCard].phoneNumber = document.getElementById("info-phone-number").value;
    contactArray[currentCard].city = document.getElementById("info-city").value;
    contactArray[currentCard].state = document.getElementById("info-state").value;
    contactArray[currentCard].zip = document.getElementById("info-zip").value;
    contactArray[currentCard].lat = document.getElementById("info-lat").value;
    contactArray[currentCard].lng = document.getElementById("info-lng").value;

    // update Bootstrap card
    document.getElementById("card-pref-name-"+currentCard).innerHTML = contactArray[currentCard].preferredName;
    document.getElementById("card-full-name-"+currentCard).innerHTML = contactArray[currentCard].lastName + ', ' + contactArray[currentCard].firstName;
    document.getElementById("card-email-"+currentCard).innerHTML = contactArray[currentCard].email;
    document.getElementById("card-phone-number-"+currentCard).innerHTML = contactArray[currentCard].phoneNumber;

    document.getElementById("info-modal-header").innerHTML = contactArray[currentCard].preferredName;

    $('#the-one-modal').modal('hide');
}

function deleteCard()
{
    $('#the-one-modal').modal('hide');
    document.getElementById("card-"+currentCard).remove();

    contactArray.splice(currentCard, 1);
    reloadCards();
}

function deleteAllCards()
{
    document.getElementById("insertingRow").remove();
    var containerHtml = [
        '<div class="row" id="insertingRow">',
            '</div>'
    ].join('');
    document.getElementById("mainContainer").innerHTML += containerHtml;
}

function reloadCards()
{
    deleteAllCards();

    // Recreate all cards because the system I started with was messy
    //  and I'm in too deep
    for (i = 0; i < contactArray.length; i++)
    {
        var html = [
        '<div id="card-'+i+'" class="col-md-3 col-sm-6">',
            '<div class="card h-100" data-toggle="modal" data-target="#the-one-modal" onclick="loadCard('+i+')">',
                '<div class="card-body">',
                    '<div id="card-pref-name-'+i+'">'+ contactArray[i].preferredName +'</div><br>',
                    '<div id="card-full-name-'+i+'">'+ contactArray[i].lastName + ', ' + contactArray[i].firstName + '</div><br>',
                    '<div id="card-email-'+i+'">'+ contactArray[i].email +'</div><br>',
                    '<div id="card-phone-number-'+i+'">' + contactArray[i].phoneNumber + '</div>',
                '</div>',
            '</div>',
        '</div>'
        ].join('');

        document.getElementById("insertingRow").innerHTML += html;
    }
    addCreateCardToEnd();
}

function addCreateCardToEnd()
{
    var html = [
    '<div id="card-new" class="col-md-3 col-sm-6">',
        '<div class="card h-100" data-toggle="modal" data-target="#second-modal">',
            '<div class="card-body">',
                '<div>Add New Contact</div><br>',
            '</div>',
        '</div>',
    '</div>'
    ].join('');

    document.getElementById("insertingRow").innerHTML += html;
}

function createCard()
{
    var newContact = {
        "firstName": document.getElementById("new-first-name").value,
        "lastName": document.getElementById("new-last-name").value,
        "preferredName": document.getElementById("new-preferred-name").value,
        "email": document.getElementById("new-phone-number").value,
        "phoneNumber": document.getElementById("new-email").value,
        "city": document.getElementById("new-city").value,
        "state": document.getElementById("new-state").value,
        "zip": document.getElementById("new-zip").value,
        "lat": document.getElementById("new-lat").value,
        "lng": document.getElementById("new-lng").value
    };
    contactArray.push(newContact);

    reloadCards();
    $('#second-modal').modal('hide');
    clearCreateTextboxes();
}

function clearCreateTextboxes()
{
    document.getElementById("new-first-name").value = "";
    document.getElementById("new-last-name").value = "";
    document.getElementById("new-preferred-name").value = "";
    document.getElementById("new-phone-number").value = "";
    document.getElementById("new-email").value = "";
    document.getElementById("new-city").value = "";
    document.getElementById("new-state").value = "";
    document.getElementById("new-zip").value = "";
    document.getElementById("new-lat").value = "";
    document.getElementById("new-lng").value = "";
}

function zipToCityState()
{
    var zip = document.getElementById("new-zip").value;

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            if (result != "")
            {
                var place = result.split(', ');
                if (document.getElementById("new-city").value == "" && document.getElementById("new-state").value == "")
                {
                    document.getElementById("new-city").value = place[0];
                    document.getElementById("new-state").value = place[1];
                }
            }
        }
    }
    request.open("GET", "zip-to-city-state.php?zip="+zip);
    request.send(null);
}

$(document).ready(function() {
    var states = [
        "AL","AK","AZ",
        "AR","CA","CO",
        "CT","DE","FL",
        "GA","HI","ID",
        "IL","IN","IA",
        "KS","KY","LA",
        "ME","MD","MA",
        "MI","MN","MS",
        "MO","MT","NE",
        "NV","NH","NJ",
        "NM","NY","NC",
        "ND","OH","OK",
        "OR","PA","RI",
        "SC","SD","TN",
        "TX","UT","VT",
        "VA","WA","WV",
        "WI","WY"
      ];
      
      $("#new-state").autocomplete({
        source: states
      });
      $("#info-state").autocomplete({
        source: states
      });
});

