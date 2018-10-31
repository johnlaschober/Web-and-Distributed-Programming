
var contactURLArray = [];
var contactArray = [];
var loadingContact = 0;

function initApplication() {
    console.log('Mustang Lite - Starting!'); 
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
    // Clear the current contactArray.
    console.log(contactURLArray.length);
    contactArray.length = 0;

    // Note that W3C documentation and my experimentation indicate that each XMLHttpRequest callback function must be a 
    // unique instance of a function. A better implmentation would have had an array of callback functions and a multithreaded
    // inplementation instead of a recursive synchronous call to load.
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
        console.log("Contact: " + contact.firstName);
        var html = [
            '<div class="col-xs-4">',
            '<div class="card" style="width: 18rem;">',
            '<div class="card-body">',
            '<div>'+ contact.firstName +'</div><br>',
            '<div>'+ contact.lastName +'</div><br>',
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
    contactRequest.onerror = function() {
        loadingContact++;
        if (contactURLArray.length > loadingContact) {
            loadContactAt(loadingContact);
        }
    }
    contactRequest.send();

}