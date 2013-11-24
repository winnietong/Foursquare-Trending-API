$(document).ready(function(){

    // Google Maps API
    var API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE";

    // FourSquare API
    var oauthToken= "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";
    var clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T";
    var clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";
    var dateVerified = "v=20131016";
    var dataCount = 20; //number of venues I'm pulling
    var locations = [];

    grabData();

    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(37.786, -122.401)
    };
    var map = new google.maps.Map($("#map-canvas")[0], mapOptions);  //[0] gets HTMLElement

    function grabData(){
        var url = "https://api.foursquare.com/v2/venues/search?ll=37.786,-122.401&limit=20&radius=1000&" + clientID + "&" + clientSecret + "&" + dateVerified;
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: url,
            success: function(response) {
                console.log(response);
                showData(response);
            }
        });
        console.log(url);
    }

    function showData(response){
        for ( var i=0; i < dataCount; i++){
            // Q: should I be creating a new var each time?
            var venueLat = response.response.venues[i].location.lat;
            var venueLng = response.response.venues[i].location.lng;
            var venueHereNow = response.response.venues[i].hereNow.count;

            locations[i] = {};
            locations[i].lat = venueLat;
            locations[i].lng = venueLng;
            console.log(locations[i], venueHereNow);

            if (venueHereNow > 0){
                var venueName = response.response.venues[i].name;
                console.log(venueName);
                $("#venueName").append(venueName + ", " + venueHereNow + " check-in(s) <br>");
                drawMarkers(locations[i].lat, locations[i].lng);
            }
        }
    }

    function drawMarkers(lat, lng){
        var markerOptions = {
            map: map,
            position: new google.maps.LatLng(lat, lng)
        };
        var marker = new google.maps.Marker(markerOptions);
    }

});