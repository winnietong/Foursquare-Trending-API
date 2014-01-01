(function() {
  var API_KEY, addressSubmitHandler, createMapAtLatLng, geocoder, latLng, map, showData, venueName, venues;

  window.Winnie = {};

  API_KEY = "AIzaSyCbtF0CCKkVZBqug9bPDhvJ7kOyZhx_2eE";

  venues = [];

  venueName = "";

  geocoder = null;

  map = null;

  latLng = new google.maps.LatLng(37.786, -122.401);

  createMapAtLatLng = function(latLng) {
    var fourSquare, mapOptions;
    geocoder = new google.maps.Geocoder();
    mapOptions = {
      zoom: 14,
      center: latLng
    };
    map = new google.maps.Map($("#map-canvas")[0], mapOptions);
    fourSquare = new Winnie.FourSquare();
    return fourSquare.getData(latLng, showData);
  };

  showData = function(response) {
    var venue, venueData, venueHTML, _i, _len, _ref, _results;
    $('#venueName').html('');
    venues = [];
    _ref = response.response.venues;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      venueData = _ref[_i];
      venue = new Winnie.Venue();
      $.extend(venue, {
        lat: venueData.location.lat,
        lng: venueData.location.lng,
        hereNowCount: venueData.hereNow.count,
        name: venueData.name,
        url: venueData.url,
        checkinCount: venueData.stats.checkinsCount,
        category: venueData.categories[0].name,
        address: venueData.location.address,
        city: venueData.location.city,
        state: venueData.location.state,
        compactVenueName: venueData.name.replace(/[^a-zA-Z0-9-]/g, '')
      });
      venueHTML = JST['templates/venue_listing'](venue);
      $("#venueName").append(venueHTML);
      venue.drawMarkers(map);
      _results.push(venues.push(venue));
    }
    return _results;
  };

  addressSubmitHandler = function(e) {
    var address;
    e.preventDefault();
    address = $('#address').val();
    return geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        latLng = results[0].geometry.location;
        return createMapAtLatLng(latLng);
      } else {
        return alert("Geocode was not successful for the following reason: " + status);
      }
    });
  };

  $(function() {
    createMapAtLatLng(latLng);
    $('#geocode-click').click(addressSubmitHandler);
    return $('#address').keydown(function(e) {
      if (e.keyCode === 13) {
        return addressSubmitHandler(e);
      }
    });
  });

}).call(this);
(function() {
  var clientID, clientSecret, dateVerified, oauthToken;

  oauthToken = "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";

  clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T";

  clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG";

  dateVerified = "v=20131016";

  Winnie.FourSquare = (function() {
    function FourSquare() {}

    FourSquare.prototype.getData = function(latLng, callback) {
      var lat, lng, url;
      lat = latLng.lat();
      lng = latLng.lng();
      url = "https://api.foursquare.com/v2/venues/trending?ll=" + lat + "," + lng + "&limit=20&radius=5000&" + clientID + "&" + clientSecret + "&" + dateVerified;
      console.log(url);
      return $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url,
        success: function(response) {
          return callback(response);
        }
      });
    };

    return FourSquare;

  })();

}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/venue_listing"] = (function() {
    this.Skim = {
      access: function(name) {
        var value;
        value = this[name];
        if (typeof value === "function") {
          value = value.call(this);
        }
        if (value === true) {
          return [this];
        }
        if (value === false || (value == null)) {
          return false;
        }
        if (Object.prototype.toString.call(value) !== "[object Array]") {
          return [value];
        }
        if (value.length === 0) {
          return false;
        }
        return value;
      },
      withContext: function(context, block) {
        var create, flatten;
        create = function(o) {
          var F;
          F = function() {};
          F.prototype = o;
          return new F;
        };
        context = create(context);
        context.safe || (context.safe = this.safe || function(value) {
          var result;
          if (value != null ? value.skimSafe : void 0) {
            return value;
          }
          result = new String(value != null ? value : '');
          result.skimSafe = true;
          return result;
        });
        context.isArray = Array.isArray || function(value) {
          return {}.toString.call(value) === '[object Array]';
        };
        context.flatten = flatten = function(array) {
          var element, flattened, _i, _len;
          flattened = [];
          for (_i = 0, _len = array.length; _i < _len; _i++) {
            element = array[_i];
            if (element instanceof Array) {
              flattened = flattened.concat(flatten(element));
            } else {
              flattened.push(element);
            }
          }
          return flattened;
        };
        context.escape || (context.escape = this.escape || function(string) {
          if (string == null) {
            return '';
          }
          if (string.skimSafe || !/[&<>\"]/.test(string)) {
            return string;
          }
          return this.safe(('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
        });
        return block.call(context);
      }
    };
  
    return function(context) {
      if (context == null) {
        context = {};
      }
      return Skim.withContext.call({}, context, function() {
        var item, _buf, _i, _j, _len, _len1, _skim_codeattributes1, _skim_codeattributes2, _temple_coffeescript_attributeremover1;
        _buf = '';
        _buf += "<div";
        _temple_coffeescript_attributeremover1 = '';
        _skim_codeattributes1 = this.compactVenueName;
        if (this.isArray(_skim_codeattributes1)) {
          _skim_codeattributes1 = this.flatten(_skim_codeattributes1);
          for (_i = 0, _len = _skim_codeattributes1.length; _i < _len; _i++) {
            item = _skim_codeattributes1[_i];
            if (item) {
              _skim_codeattributes1 = item.toString();
            }
          }
          for (_j = 0, _len1 = _skim_codeattributes1.length; _j < _len1; _j++) {
            item = _skim_codeattributes1[_j];
            if (item.length > 0) {
              _skim_codeattributes1 = item;
            }
          }
          _temple_coffeescript_attributeremover1 += this.escape(_skim_codeattributes1.join(" "));
        } else {
          _temple_coffeescript_attributeremover1 += this.escape(_skim_codeattributes1);
        }
        _temple_coffeescript_attributeremover1;
        if (_temple_coffeescript_attributeremover1.length > 0) {
          _buf += " class=\"";
          _buf += _temple_coffeescript_attributeremover1;
          _buf += "\"";
        }
        _buf += "><a";
        _skim_codeattributes2 = this.url;
        switch (_skim_codeattributes2) {
          case true:
            _buf += " href=\"href\"";
            break;
          case false:
          case null:
            break;
          default:
            _buf += " href=\"";
            _buf += this.escape(_skim_codeattributes2);
            _buf += "\"";
        }
        _buf += "><h2 class=\"venueName-field\">";
        _buf += this.escape(this.name);
        _buf += "</h2></a></div><div class=\"address-field\"><h3>";
        _buf += this.escape(this.address);
        _buf += "</h3><h3>";
        _buf += this.escape("" + this.city + ", " + this.state);
        _buf += "</h3></div><div class=\"details-field\"><p>";
        _buf += this.escape("(" + this.category + ")");
        _buf += "</p><p>";
        _buf += this.escape("Here Now: " + this.hereNowCount);
        _buf += "</p><p>";
        _buf += this.escape("Checkins: " + this.checkinCount);
        _buf += "</p></div>";
        return _buf;
      });
    };
  
  }).call(this);;
}).call(this);
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
