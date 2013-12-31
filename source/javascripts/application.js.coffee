#= require_self
#= require_tree '.'

window.Winnie = {}

# Google Maps API
API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE"

# FourSquare API
oauthToken= "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T"
clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
dateVerified = "v=20131016"

# Other
venues = []
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
    venues = []

    for venueData in response.response.venues
        venue = new Winnie.Venue()

        $.extend venue,
            lat: venueData.location.lat
            lng: venueData.location.lng
            hereNowCount: venueData.hereNow.count

            name: venueData.name
            url: venueData.url
            checkinCount: venueData.stats.checkinsCount

            category: venueData.categories[0].name
            address: venueData.location.address
            city: venueData.location.city
            state: venueData.location.state
            compactVenueName: venueData.name.replace(/[^a-zA-Z0-9-]/g, '')

        venueHTML = JST['templates/venue_listing'](venue)

        $("#venueName").append(venueHTML)

        venue.drawMarkers(map)
        venues.push venue



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
            