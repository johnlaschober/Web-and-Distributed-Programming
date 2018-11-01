var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;

function initApplication() {
    console.log('Mustang v1 - Starting!'); 
    loadIndex();
}

function loadIndex() {
    // Load the Mustang index file.
    var indexRequest = new XMLHttpRequest();
    indexRequest.open('GET', 'https://mustang-index.azurewebsites.net/index.json');
    indexRequest.onload = function() {
        console.log("Index JSON:" + indexRequest.responseText);
        contactIndex = JSON.parse(indexRequest.responseText);
        for (i=0; i<contactIndex.length; i++) {
            contactURLArray.push(contactIndex[i].ContactURL);
        }
        console.log("ContactURLArray: " + JSON.stringify(contactURLArray));
    }
    indexRequest.send();
}

function loadContacts() {
    var loadButton = document.getElementById("loadButton");
    loadButton.parentNode.removeChild(loadButton);

    // Clear the current contactArray.
    console.log(contactURLArray.length);
    contactArray.length = 0;

    if (contactURLArray.length > loadingContact) {
        loadContactAt(loadingContact);
    }
}

function loadContactAt(i)
{
    console.log("Loading: " + i);
    contactRequest = new XMLHttpRequest();
    contactRequest.open('GET', contactURLArray[i]);
    console.log(contactRequest);

    contactRequest.onload = function() {
        console.log(contactRequest.responseText);
        var contact;
        contact = JSON.parse(contactRequest.responseText);
        contactArray.push(contact);
        console.log("Contact: " + contact.firstName);
        var html = [
        '<div class="col-md-3 col-sm-6">',
            '<div class="card h-100" data-toggle="modal" data-target="#the-one-modal" onclick="loadCard('+loadingContact+')">',
                '<div class="card-body">',
                    '<div>'+ contact.preferredName +'</div><br>',
                    '<div>'+ contact.lastName + ', ' + contact.firstName + '</div><br>',
                    '<div>'+ contact.email +'</div><br>',
                    '<div>' + contact.phoneNumber + '</div>',
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

function loadCard(number)
{
    document.getElementById("info-modal-header").innerHTML = contactArray[number].preferredName;

    document.getElementById("info-first-name").innerHTML = "First Name: " + contactArray[number].firstName;
    document.getElementById("info-last-name").innerHTML = "Last Name: " + contactArray[number].lastName;
    document.getElementById("info-preferred-name").innerHTML = "Preferred Name: " + contactArray[number].preferredName;
    document.getElementById("info-email").innerHTML = "Email: " + contactArray[number].email;
    document.getElementById("info-phone-number").innerHTML = "Phone Number: " + contactArray[number].phoneNumber;
    document.getElementById("info-city").innerHTML = "City: " + contactArray[number].city;
    document.getElementById("info-state").innerHTML = "State: " + contactArray[number].state;
    document.getElementById("info-zip").innerHTML = "Zip: " + contactArray[number].zip;
    document.getElementById("info-lat").innerHTML = "Lat: " + contactArray[number].lat;
    document.getElementById("info-lng").innerHTML = "Lng: " + contactArray[number].lng;
    document.getElementById("info-favorite-hobby").innerHTML = "Favorite Hobby: " + contactArray[number].favoriteHobby;
}
