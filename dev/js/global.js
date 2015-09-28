function GlobalClass() {
  this.init = function(){
    this.installObservers();
    if (this.hasOwnProperty('uid')) {
      this.locationSearch();
      this.setInitialLocation();
      this.installAuthedObservers();
    }
	};

	this.installObservers = function(){
	};

  this.installAuthedObservers = function() {
    $('#js-city-search').click(function(){
      $(this).select();
    });
  };

  this.setInitialLocation = function() {
    var user_lat = Global.currentCoords.lat;
    var user_lon = Global.currentCoords.lon;

    var geocoder = new google.maps.Geocoder();

    var latlng = {lat: parseFloat(user_lat), lng: parseFloat(user_lon)};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          var city = results[3].formatted_address;
          console.log(results);
          $('#js-city-search').val(results[3].formatted_address);

        } else {
          window.alert('Could not find the name of your Tinder location.');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  };


  this.locationSearch = function() {
    var input = /** @type {!HTMLInputElement} */(
    document.getElementById('js-city-search'));

    var ac_options = {
      "types": ["(cities)"]
    };
    var autocomplete = new google.maps.places.Autocomplete(input, ac_options);
    var infowindow = new google.maps.InfoWindow();

    autocomplete.addListener('place_changed', function() {
      $('.js-city-error').transition({'opacity':0}).hide();

      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        var message = "Nada, hombre.\n\nDid you enter a city name?";

        var city_error = $('.js-city-error');
        $(city_error).transition({'opacity':0}).show();
        $(city_error).html(message).transition({'opacity':1});


        return;
      }

      var coord_lat = place.geometry.location.H;
      var coord_lon = place.geometry.location.L;
      console.log(coord_lon);
      $.ajax({
          type: "POST",
          url: '/change-location',
          data: {
            'xAuthToken': Global.uid,
            'new_lat': parseFloat(coord_lat).toFixed(6),
            'new_lon': parseFloat(coord_lon).toFixed(6)
          },
          dataType: 'json',
          success: function(msg) {
            console.log(msg);

            if(msg.hasOwnProperty('error')) {
              errors = {
                'change_timeout': 'major position change not significant'
              };

              if(msg.error == errors.change_timeout) {
                alert("Error - Tinder only lets you change location once every 15 minutes :(");
              }
            } else {
              Global.currentCoords = {
                "lat": coord_lat,
                "long": coord_lon
              };

              alert("Location change successful!");
            }
          }
        });

    });
  };

	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

  this.preloadImages = function(arrayOfImages) {
      $(arrayOfImages).each(function(){
          $('<img/>')[0].src = this;
          // Alternatively you could use:
          // (new Image()).src = this;
      });
  };

  this.getParameterByName = function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };
}

Global = new GlobalClass();
