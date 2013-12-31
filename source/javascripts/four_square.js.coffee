# FourSquare API
oauthToken= "oauth_token=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
clientID = "client_id=B0AH0SS14AFO2NNZQTY5OI1NQXK354RB2H2VVNZTDZ2IOD5T"
clientSecret = "client_secret=ZV0XUIFVWLI0MSW5GQC2DDNQM2AXOS5KMVN0CTCQJ3BV3CMG"
dateVerified = "v=20131016"

class Winnie.FourSquare
	getData: (latLng, callback) ->
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
	            callback(response)