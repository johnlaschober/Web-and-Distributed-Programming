var map;

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 2,
            fullscreenControl: false // No more pesky wives breaking our websites
            // mapTypeControl: false
            // mapTypeId: 'satellite'
    });

    var myLatLng = new google.maps.LatLng({lat: -23, lng: 131}); 
    var illinoisLatLng = new google.maps.LatLng({lat: 41.6048, lng: -88});

    var testMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'This is a test marker at a test location.'
    });

    var illinoisMarker = new google.maps.Marker({
        position: illinoisLatLng,
        map: map,
        title: 'Somewhere in Illinois',
        // label: "I",
        icon: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"  // This is my extra functionality from another tutorial
    });

    testMarker.addListener('click', function() {
        map.setZoom(8);
        map.setCenter(testMarker.getPosition());
    }); 

    map.addListener('idle', function() { // Using idle instead of bounds_changed for this assignment
        // 0=zoomed out | 22=zoomed in
        document.getElementById("zoomLevel").innerHTML = "Zoom level: " + map.zoom;

        var bounds = map.getBounds();

        if (bounds.contains(myLatLng))
        {
            document.getElementById("inBoundStatus").innerHTML = "myLatLng object is in the current bounds." ;
            console.log("myLatLng object is in the current bounds.");
            if (map.getZoom() >= 14)
            {
                document.getElementById("inBoundStatus").innerHTML = "myLatLng object is in the current bounds and at the minimum zoom level (14).";
            }
        }
        else
        {
        document.getElementById("inBoundStatus").innerHTML = "myLatLng object is NOT in the current bounds.";
        }
    });

    // Go back and stick all game functionality in an UpdateGame() for map-mania v2
}