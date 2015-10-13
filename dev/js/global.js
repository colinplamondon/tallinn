function GlobalClass() {
  this.init = function(){
    this.installObservers();
    if (this.hasOwnProperty('uid')) {
      this.locationSearch();
      this.setInitialLocation();
      this.installAuthedObservers();

      // style active nav box
      $('.nav-box').removeClass('active');
      $('.nav-box[data-page="'+this.currentPage+'"]').addClass('active');
    }

	};

	this.installObservers = function(){
	};

  this.installAuthedObservers = function() {
    $('#js-city-search').click(function(){
      $(this).select();
    });

    $('.nav-box').click(function(){
      var target_page = $(this).data('page');

      switch(target_page) {
        case "likes":
          window.location.href = Like.url;
          break;
        case "chat":
          window.location.href = Chat.url;
          break;
        default:
          window.location.href = Like.url;
      }
    });
  };

  this.returnCurrentCity = function(callback) {
    var user_lat = Global.currentCoords.lat;
    var user_lon = Global.currentCoords.lon;

    var geocoder = new google.maps.Geocoder();

    var latlng = {lat: parseFloat(user_lat), lng: parseFloat(user_lon)};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          // "Riga, Latvia"
          full_name = results[3];
          // "Riga"
          just_city = full_name.address_components[0].long_name;
          callback(full_name.formatted_address, just_city);
        } else {
          window.alert('Could not find the name of your Tinder location.');
          return false;
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
        return false;
      }
    });
  };

  this.setInitialLocation = function() {
    this.returnCurrentCity(function(full_name, city_name){
      $('#js-city-search').val(full_name);
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

  this.insertAtCaret = function(areaId,text) {
    var range;
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
        txtarea.focus();
        range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);
    var back = (txtarea.value).substring(strPos,txtarea.value.length);
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range2;
        range2 = document.selection.createRange();
        range2.moveStart ('character', -txtarea.value.length);
        range2.moveStart ('character', strPos);
        range2.moveEnd ('character', 0);
        range2.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
};

}

Global = new GlobalClass();
