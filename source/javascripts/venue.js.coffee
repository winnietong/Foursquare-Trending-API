class Winnie.Venue
    drawMarkers: (map) ->
        contentString = '<div style= "overflow: hidden; white-space: nowrap; height: 14px;">' + @name + ' (' + @hereNowCount + ')</div>'

        infoWindow = new google.maps.InfoWindow
            content: contentString
        
        marker = new google.maps.Marker
            map: map
            position: new google.maps.LatLng(@lat, @lng)

        google.maps.event.addListener marker, 'click', ->
            infoWindow.open(map, marker)
        
        google.maps.event.addListener marker, 'mouseout', ->
            infoWindow.close(map, marker)

        $("." + @compactVenueName).mouseenter ->
            infoWindow.open(map, marker)
        
        $("." + @compactVenueName).mouseleave ->
            infoWindow.close(map, marker)