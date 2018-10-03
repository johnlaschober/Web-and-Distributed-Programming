var map;

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 0, lng: 0},
            zoom: 2
            // mapTypeId: 'satellite'
    });

    var myLatLng = new google.maps.LatLng({lat: -23, lng: 131}); 
        

    var testMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'This is a test marker at a test location.'
    });

    testMarker.addListener('click', function() {
        map.setZoom(8);
        map.setCenter(testMarker.getPosition());
    }); 

    map.addListener('idle', function() {
        // 0=zoomed out | 22=zoomed in
        document.getElementById("zoomLevel").innerHTML = "Zoom level: " + map.zoom;

        var bounds = map.getBounds();

        if (bounds.contains(myLatLng))
        {
            document.getElementById("inBoundStatus").innerHTML = "myLatLng object is in the current bounds." ;

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

    // Go back and stick all game functionality in an UpdateGame()
}