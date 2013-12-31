
# Google Maps API
API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE"

# FourSquare API
oauthToken= "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T"
clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
dateVerified = "v=20131016"

# Other
locations = []
venueName = ""
geocoder = null
map = null
latLng = new google.maps.LatLng(37.786, -122.401)

initialize = (latLng) ->
    geocoder = new google.maps.Geocoder()
    mapOptions =
        zoom: 14,
        center: latLng
    
    map = new google.maps.Map($("#map-canvas")[0], mapOptions)
    getData(latLng)

getData = (latLng) ->
    lat = latLng.lat()
    lng = latLng.lng()
    url = "https://api.foursquare.com/v2/venues/trending?ll=#{lat},#{lng}&limit=20&radius=5000&#{clientID}&#{clientSecret}&#{dateVerified}"
    console.log(url)
    $.ajax
        type: "GET"
        dataType: "jsonp"
        cache: false
        url: url
        success: (response) ->
            showData(response)
        
showData = (response) ->
    # Clear div before rewriting list.
    $('#venueName').html('')
    locations = []

    for venue in response.response.venues

        venueLat = venue.location.lat
        venueLng = venue.location.lng
        venueHereNow = venue.hereNow.count

        location = {}
        location.lat = venueLat
        location.lng = venueLng

        venueName = venue.name
        URL = venue.url
        checkins = venue.stats.checkinsCount

        category = venue.categories[0].name
        address = venue.location.address
        city =  venue.location.city
        state = venue.location.state
        venueNameNS = venueName.replace(/[^a-zA-Z0-9-]/g, '')

        venueHTML = "<div class='"+ venueNameNS + "'><a href='" + URL + "'><h2 class='venueName-field'>" + venueName + "</a></h2>"
        addressHTML = "<div class='address-field'><h3>"+ address + "</h3><h3>" + city + ", " + state + "</h3></div>"
        detailsHTML = "<div class='details-field'><p>(" + category + ")</p><p>Here Now: " + venueHereNow + "</p><p>Checkins: " + checkins + "</p></div>"
        
        $("#venueName").append(venueHTML + addressHTML + detailsHTML)

        drawMarkers(location.lat, location.lng, venueName, venueHereNow, venueNameNS)

        locations.push location

drawMarkers = (lat, lng, venueName, venueHereNow, venueNameNS) ->

    contentString = '<div style= "overflow: hidden; white-space: nowrap; height: 14px;">' + venueName + ' (' + venueHereNow + ')</div>'

    infowindow = new google.maps.InfoWindow
        content: contentString

    markerOptions =
        map: map
        position: new google.maps.LatLng(lat, lng)
    
    marker = new google.maps.Marker(markerOptions)

    google.maps.event.addListener marker, 'click', ->
        infowindow.open(map, marker)
    
    google.maps.event.addListener marker, 'mouseout', ->
        infowindow.close(map,marker)

    $("." + venueNameNS).mouseenter ->
        infowindow.open(map,marker)
    
    $("." + venueNameNS).mouseleave ->
        infowindow.close(map,marker)

$ ->
    initialize(latLng)

    $('#geocode-click').click ->
        address = $('#address').val()
        
        geocoder.geocode {'address': address}, (results, status) ->
            if status == google.maps.GeocoderStatus.OK
                latLng = results[0].geometry.location
                map.setCenter(latLng)
                initialize(latLng)
            
            else
                alert "Geocode was not successful for the following reason: #{status}"
            