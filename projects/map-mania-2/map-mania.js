var gMap;

var favoritePlaces = [
    {"content":"Louvre Museum", "coordinates":{"lat":48.860611,"lng":2.337644}, "iconImagePath":"flag.png"},
    {"content":"Badlands National Park", "coordinates":{"lat":43.907810,"lng":-102.332787}, "iconImagePath":"flag.png"},
    {"content":"Pike Place Market", "coordinates":{"lat":47.609630,"lng":-122.342150}, "iconImagePath":"flag.png"},
    {"content":"Guggenheim Museum Bilbao", "coordinates":{"lat":43.268428,"lng":-2.934061}, "iconImagePath":"flag.png"},
    {"content":"Buckingham Palace", "coordinates":{"lat":51.501366,"lng":-0.141890}, "iconImagePath":"flag.png"},
    {"content":"New York City", "coordinates":{"lat":40.712776,"lng":-74.005974}, "iconImagePath":"flag.png"},
    {"content":"Niagara Falls", "coordinates":{"lat":43.082817,"lng":-79.074165}, "iconImagePath":"flag.png"},
    {"content":"Universal Studios Florida", "coordinates":{"lat":28.433180,"lng":-81.455570}, "iconImagePath":"flag.png"},
    {"content":"Plaza de España", "coordinates":{"lat":42.607540,"lng":-7.769260}, "iconImagePath":"flag.png"},
    {"content":"Channahon Community Park", "coordinates":{"lat":41.474930,"lng":-88.168550}, "iconImagePath":"flag.png"},
]; 
var currentPlaceIndex = favoritePlaces.length;
var currentPlace = favoritePlaces[currentPlaceIndex];
var currentLatLng;
var gameFinished = false;

function initApp() {
    // console.log("Starting app");
    document.getElementById("score").innerHTML = "Score: " + "0" + "/" + (favoritePlaces.length.toString());
    document.getElementById("thermometerImage").draggable = false;
}

function initMap() {
    gMap = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 2,
            fullscreenControl: false 
    });
    nextPlace();

    gMap.addListener('idle', function() {
        // console.log(getLatLngDifference(gMap.getCenter(), favoritePlaces[currentPlaceIndex]));

        if (gMap.getBounds().contains(currentLatLng) && gMap.getZoom() >= 8 && !gameFinished)
        {
            // console.log(currentPlace.content + " is in");
            addMarker(currentPlace);
            resetMapZoom();
            nextPlace();
        }
    });

    gMap.addListener('bounds_changed', function(){
        getLatLngDifference(gMap.getCenter(), favoritePlaces[currentPlaceIndex]);
    });
}

function getLatLngDifference(place1, place2) {
    var difference = (Math.abs(parseFloat(place1.lat() - parseFloat(place2.coordinates.lat)))) + (Math.abs(parseFloat(place1.lng() - parseFloat(place2.coordinates.lng))));

    var bar = document.getElementById("temperature");
    if (!gameFinished)
    {
        if (difference > 80)
        {
            bar.style.height = "5" + '%';
        }
        else
        {
            bar.style.height = (75 - difference) + '%';
        }
    }
    return difference;
}

function nextPlace() {
    if (currentPlaceIndex > 0)
    {
        currentPlaceIndex--;
        currentPlace = favoritePlaces[currentPlaceIndex];
        // console.log("current index " + currentPlaceIndex);
        // console.log("current place " + currentPlace.content);
        currentLatLng = new google.maps.LatLng(currentPlace.coordinates.lat, currentPlace.coordinates.lng);
        getLatLngDifference(gMap.getCenter(), favoritePlaces[currentPlaceIndex]);
    }
    else
    {
        finishGame();
    }
}

function resetMapZoom() {
    gMap.setZoom(2);
    gMap.setCenter({lat: 0, lng: 0});
}

function addMarker(markerContent) {
    var marker = new google.maps.Marker({position:markerContent.coordinates, map:gMap});
    if (markerContent.iconImagePath) {
        try {
            marker.setIcon(markerContent.iconImagePath);
        }
        catch (err) {
            marker.setIcon("flag.png");
        }
    }
    else {
        marker.setIcon("flag.png");
    }

    if (markerContent.content) {
        var infoWindow = new google.maps.InfoWindow({"content":markerContent.content});
        infoWindow.open(gMap, marker);
        marker.addListener("click", function() { infoWindow.open(gMap, marker) });
    }

    addPoints();
}

var totalPoints = 0;

function addPoints() {
    totalPoints++;
    document.getElementById("score").innerHTML = "Score: " + (totalPoints.toString()) + "/" + (favoritePlaces.length.toString());
}

var timerRunning = false;
var delta = 0;

function startTimer() {
    var start = Date.now();
    timerRunning = true;
    setInterval(function() {
        if (timerRunning)
        {
            delta = Date.now() - start;
            document.getElementById("timer").innerHTML = "Time: " + Math.floor(delta/1000);
        }
    }, 1000);
}

function stopTimer() {
    timerRunning = false;
}

function finishGame() {
    stopTimer();
    revealAll();
    document.getElementById("resultsModalInner").innerHTML = "Congratulations! You found all " + (favoritePlaces.length.toString()) + " locations in " + (Math.floor(delta/1000).toString()) + " seconds!";
    $('#resultsModal').modal('show');
    gameFinished = true;
    document.getElementById("temperature").style.height = "0%";
    document.getElementById("thermometerImage").style.height = "0%";
    document.getElementById("instructions").innerHTML = "";
}

function revealAll() {
    for (i=totalPoints; i<favoritePlaces.length; i++) { 
        addMarker(currentPlace);
        nextPlace();
    }
}

function showInstructions() {
    $('#instructionsModal').modal('show');
}