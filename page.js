/*   Javascript Author: Jaskirat Kaur Student ID: 000904397 Date: 13 October, 2024
        
        StAuth10244: I Jaskirat Kaur, 000904397 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.


		The file consists of function that to initializing the Google Map, add markers for various locations, filtering these markers, showing geolocation of the user
        and provide directions to selected destinations. 

*/


/* For holding the map instance*/
let map;

/* For holding markers for different locations*/
const markers = [];

/* For categorizing the markers */
const categories = {
    parks: [],
    museums: [],
    hotels: []
};

/* For holding user's location */
let userMarker = null;

/* For calculating directions */
let directionsService;

/* For Displaying route on the map */
let directionsRenderer;


/* For storing location data including latitude, longitude, name, category, address of locations */
const locations = [
    { position: { lat: 43.2557, lng: -79.8711 }, name: "Bayfront Park", category: "parks", address: "50 Bay St, Hamilton, ON" },
    { position: { lat: 43.2630, lng: -79.8612 }, name: "Mohawk College", category: "museums", address: "1350 Main St W, Hamilton, ON" },
    { position: { lat: 43.2405, lng: -79.8451 }, name: "Gage Park", category: "parks", address: "1000 Upper Gage Blvd W, Hamilton, ON" },
    { position: { lat: 43.2615, lng: -79.8611 }, name: "Canadian Warplane Heritage Museum", category: "museums", address: "1000 Fennell Ave, Hamilton, ON" },
    { position: { lat: 43.2275, lng: -79.8133 }, name: "Royal Botanical Gardens", category: "parks", address: "665 Plains Rd N, Burlington, ON" },
    { position: { lat: 43.2599, lng: -79.8774 }, name: "Dundurn Castle", category: "museums", address: "50 Park Pl, Hamilton, ON" },
    { position: { lat: 43.2625, lng: -79.8875 }, name: "Victoria Park", category: "parks", address: "400 Ferguson Ave, Hamilton, ON" },
    { position: { lat: 43.2241, lng: -79.8424 }, name: "Hamilton Museum of Steam & Technology", category: "museums", address: "10 Wentworth St N, Hamilton, ON" },
    { position: { lat: 43.2393, lng: -79.8475 }, name: "Chedoke Park", category: "parks", address: "600 Barton St E, Hamilton, ON" },
    { position: { lat: 43.2590, lng: -79.8750 }, name: "Art Gallery of Hamilton", category: "museums", address: "123 King St E, Hamilton, ON" },
    { position: { lat: 43.2500, lng: -79.8831 }, name: "Sheraton Hamilton Hotel", category: "hotels", address: "116 King St W, Hamilton, ON" },
    { position: { lat: 43.2571, lng: -79.8672 }, name: "Staybridge Suites Hamilton - Downtown", category: "hotels", address: "20 Caroline St S, Hamilton, ON" },
    { position: { lat: 43.2565, lng: -79.8761 }, name: "Homewood Suites by Hilton", category: "hotels", address: "40 Bay St S, Hamilton, ON" }
];


/** For initializing map for the application */
function initMap() {
    console.log("Initializing Map...");
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    // Initialize Map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 43.2557, lng: -79.8711 }, // Hamilton, ON
        zoom: 12
    });

    
    directionsRenderer.setMap(map);

    const infoWindow = new google.maps.InfoWindow();

    // Adding  Markers to the map
    locations.forEach((loc, index) => {
        const marker = new google.maps.Marker({
            position: loc.position,
            map: map,
            title: loc.name,
            icon: getMarkerIcon(loc.category),
            id: index
        });

        // Categorizing  markers in different categories
        if (loc.category === "parks") {
            categories.parks.push(marker);
        } else if (loc.category === "museums") {
            categories.museums.push(marker);
        }else if (loc.category === "hotels") {
            categories.hotels.push(marker); 
        }

        // Displaying information on infowindow clicking the marker 
        const contentString = `
            <div>
                <h6>${loc.name}</h6>
                <p>${loc.address}</p>
            </div>
            
        `;

        // Click-Event for Marker Infowindow 
        marker.addListener('click', () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        addToDropdown(loc.name, index);
    });

    // Filter Buttons
    document.getElementById('filter-parks').addEventListener('click', () => filterMarkers('parks'));
    document.getElementById('filter-museums').addEventListener('click', () => filterMarkers('museums'));
    document.getElementById('filter-hotels').addEventListener('click', () => filterMarkers('hotels'));
    document.getElementById('filter-all').addEventListener('click', () => showAllMarkers());

    // Geolocation Button
    document.getElementById('btn-geolocate').addEventListener('click', geolocateUser);

    // Adding Address Button
    document.getElementById('btn-add-address').addEventListener('click', addAddressMarker);

    // Getting Directions Button
    document.getElementById('btn-get-directions').addEventListener('click', calculateAndDisplayRoute);

    console.log("Map Initialized with markers.");
}



/* For setting marker Icon Based on Category */
function getMarkerIcon(category) {
    const icons = {
        parks: {
            url: 'images/park_Icon.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        museums: {
            url: 'images/museum_Icon.png',
            scaledSize: new google.maps.Size(40, 40) 
        },
        hotels: {
            url: 'images/hotel_Icon.png',
            scaledSize: new google.maps.Size(40, 40)
        },
        user: {
            url: 'images/HomeLocation_Icon.webp',
            scaledSize: new google.maps.Size(70, 70)
        },
        
    };
    return icons[category] || icons['parks'];
}


/** For filtering Markers on the basis of Category */
function filterMarkers(category) {
    console.log("Filtering markers by:", category);
    markers.forEach(marker => {
        if (locations[marker.id].category === category) {
            marker.setMap(map);
        } else {
            marker.setMap(null);
        }
    });
}

/* For displaying all Markers */
function showAllMarkers() {
    console.log("Showing all markers.");
    markers.forEach(marker => {
        marker.setMap(map);
    });
}

/* For geolocating the User and adding Marker */
function geolocateUser() {
    console.log("Geolocate User Function Called.");
    var locationDisplay = document.getElementById("btn-geolocate");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError
        );
    } else {
        locationDisplay.innerHTML = "Geolocation is not supported by this browser.";
        alert('Geolocation is not supported by this browser.');
    }
}


/** For showing and extracting user's location */
function showPosition(position) {
    
    const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    console.log("Geolocation Success:", position);
    addUserMarker(userPos);
}


/** Handling Error if user's location is not working properly  */
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }

    console.error("Geolocation Error:", error);
}


/* For adding User location's Marker */
function addUserMarker(position) {
    console.log("Adding User Marker at:", position);
    if (userMarker) {
        userMarker.setMap(null);
        console.log("Existing User Marker Removed.");
    }
    userMarker = new google.maps.Marker({
        position: position,
        map: map,
        title: "Your Location",
        icon: getMarkerIcon('user')
    });
    map.panTo(position);
    addToDropdown("Your Location", 'user');
    console.log("User Marker Added.");
}

/* For adding Marker by taking Address Input */
function addAddressMarker() {
    const address = document.getElementById('address-input').value;
    console.log("Adding Address Marker for:", address);
    if (!address) {
        alert('Please enter a valid address.');
        return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            addUserMarker(location);
            console.log("Geocoding Success:", results[0]);
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

/* For adding  different locations to Dropdowns for Directions */
function addToDropdown(name, id) {
    const originSelect = document.getElementById('origin-select');
    const destinationSelect = document.getElementById('destination-select');

    const option1 = document.createElement('option');
    option1.value = id;
    option1.text = name;
    originSelect.add(option1);

    const option2 = document.createElement('option');
    option2.value = id;
    option2.text = name;
    destinationSelect.add(option2);

    console.log(`Added "${name}" to dropdowns.`);
}

/* For setting Destination from Infowindow Button*/
function setDestination(index) {
    console.log("Setting Destination to Marker Index:", index);
    const destinationSelect = document.getElementById('destination-select');
    destinationSelect.value = index;
}


/* For calculating and displaying Route */
function calculateAndDisplayRoute() {
    const originValue = document.getElementById('origin-select').value;
    const destinationValue = document.getElementById('destination-select').value;
    console.log("Calculating route from:", originValue, "to:", destinationValue);

    if (originValue === 'user' && !userMarker) {
        alert('Please set your location first.');
        return;
    }

    let origin, destination;

    if (originValue === 'user') {
        origin = userMarker.getPosition();
    } else {
        origin = markers[originValue].getPosition();
    }

    if (destinationValue === 'user') {
        destination = userMarker.getPosition();
    } else {
        destination = markers[destinationValue].getPosition();
    }

    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                console.log("Directions successfully rendered.");
            } else {
                console.error('Directions request failed due to ' + status);
                window.alert('Directions request failed due to ' + status);
            }
        }
    );
}


window.setDestination = setDestination;