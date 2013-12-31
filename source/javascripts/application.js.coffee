#= require_self
#= require_tree '.'

window.Winnie = {}

# Google Maps API
API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE"

# Other
venues = []
venueName = ""
geocoder = null
map = null
latLng = new google.maps.LatLng(37.786, -122.401)

createMapAtLatLng = (latLng) ->
    geocoder = new google.maps.Geocoder()
    mapOptions =
        zoom: 14,
        center: latLng
    
    map = new google.maps.Map($("#map-canvas")[0], mapOptions)
    fourSquare = new Winnie.FourSquare()
    fourSquare.getData(latLng, showData)

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

addressSubmitHandler = (e) ->
    e.preventDefault()
    address = $('#address').val()
    
    geocoder.geocode {'address': address}, (results, status) ->
        if status == google.maps.GeocoderStatus.OK
            latLng = results[0].geometry.location
            # map.setCenter(latLng)
            createMapAtLatLng(latLng)
        
        else
            alert "Geocode was not successful for the following reason: #{status}"
        

$ ->
    createMapAtLatLng(latLng)

    $('#geocode-click').click addressSubmitHandler
    $('#address').keydown (e) ->
        if (e.keyCode == 13) # ENTER key
            addressSubmitHandler(e)
