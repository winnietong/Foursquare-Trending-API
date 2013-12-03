$(document).ready(function(){

    // Google Maps API
    var API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE";

    // FourSquare API
    var oauthToken= "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";
    var clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T";
    var clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";
    var dateVerified = "v=20131016";

    // Other
    var locations = [];
    var venueName = "";
    var geocoder;
    var map;
    var latLng = new google.maps.LatLng(37.786, -122.401);

    initialize(latLng);

    function initialize(latLng){
        geocoder = new google.maps.Geocoder();
        var mapOptions = {
            zoom: 14,
            center: latLng
        };
        map = new google.maps.Map($("#map-canvas")[0], mapOptions);  //[0] gets HTMLElement
        getData(latLng);
    }

    $('#geocode-click').click(function(){
        var address = $('#address').val();
        
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latLng = results[0].geometry.location;
                map.setCenter(latLng);
                initialize(latLng);
            }
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        
    });

    function getData(latLng){
        lat = latLng.ob;
        lng = latLng.pb;
        var url = "https://api.foursquare.com/v2/venues/trending?ll=" + lat + ','+ lng + "&limit=20&radius=5000&" + clientID + "&" + clientSecret + "&" + dateVerified;
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
        // LOG URL 
        console.log(url);
    }

    function showData(response){

        $('#venueName').html(''); // clear div before rewriting list

        for ( var i=0; i < response.response.venues.length; i++){
            var venueLat = response.response.venues[i].location.lat;
            var venueLng = response.response.venues[i].location.lng;
            var venueHereNow = response.response.venues[i].hereNow.count;

            locations[i] = {};
            locations[i].lat = venueLat;
            locations[i].lng = venueLng;

            venueName = response.response.venues[i].name;
            var URL = response.response.venues[i].url;
            var checkins = response.response.venues[i].stats.checkinsCount;

            var category = response.response.venues[i].categories[0].name;
            var address = response.response.venues[i].location.address;
            var city =  response.response.venues[i].location.city;
            var state = response.response.venues[i].location.state;
            var venueNameNS = venueName.replace(/[^a-zA-Z0-9-]/g, '');

            var venueCSS = "<div class='"+ venueNameNS + "'><a href='" + URL + "'><h2 class='venueName-field'>" + venueName + "</a></h2>";
            var addressCSS = "<div class='address-field'><h3>"+ address + "</h3><h3>" + city + ", " + state + "</h3></div>";
            var detailsCSS = "<div class='details-field'><p>(" + category + ")</p><p>Here Now: " + venueHereNow + "</p><p>Checkins: " + checkins + "</p></div>";
            

            $("#venueName").append(venueCSS + addressCSS + detailsCSS);

            drawMarkers(locations[i].lat, locations[i].lng, venueName, venueHereNow, venueNameNS);
        }
    }

    function drawMarkers(lat, lng, venueName, venueHereNow, venueNameNS){

        var contentString = '<div style= "overflow: hidden; white-space: nowrap; height: 14px;">' + venueName + ' (' + venueHereNow + ')</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var markerOptions = {
            map: map,
            position: new google.maps.LatLng(lat, lng)
        };
        var marker = new google.maps.Marker(markerOptions);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
        // google.maps.event.addListener(marker, 'mouseout', function() {
        //     infowindow.close(map,marker);
        // });

        $("." + venueNameNS).mouseenter(function(){
            infowindow.open(map,marker);
        });
        $("." + venueNameNS).mouseleave(function(){
            infowindow.close(map,marker);
        });

    }

});