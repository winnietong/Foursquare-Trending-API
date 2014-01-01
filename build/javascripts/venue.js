(function() {
  Winnie.Venue = (function() {
    function Venue() {}

    Venue.prototype.drawMarkers = function(map) {
      var contentString, infoWindow, marker;
      contentString = '<div style= "overflow: hidden; white-space: nowrap; height: 14px;">' + this.name + ' (' + this.hereNowCount + ')</div>';
      infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(this.lat, this.lng)
      });
      google.maps.event.addListener(marker, 'click', function() {
        return infoWindow.open(map, marker);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        return infoWindow.close(map, marker);
      });
      $("." + this.compactVenueName).mouseenter(function() {
        return infoWindow.open(map, marker);
      });
      return $("." + this.compactVenueName).mouseleave(function() {
        return infoWindow.close(map, marker);
      });
    };

    return Venue;

  })();

}).call(this);
