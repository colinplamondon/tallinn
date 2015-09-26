/*jshint multistr: true */
function LikeClass() {

  this.init = function() {
    this.originalHovercardY = $('.match-hovercard').css('top');
    this.blurEls = $(".nav, .like-ui, .rec-bar-wrap, .footer");

    this.locationSearch();
    this.installObservers();
    this.installWatchers();

    this.setInitialLocation();

    this.matchRiverStart();
    // this.recommendationRiverStart();
  };


  this.installWatchers = function() {
    // TODO: Colin, is this the right place for this? Probably not.
    // One issue to keep in mind: when this mass like is over, we
    // should probably unregister this handler so the next click
    // doesn't have two handlers hooked up.

    // States:
    // COMPLETION: If number WAS greater than 1 and NOW is 9, show
    // completion animation.

    // IN PROGRESS: Number is greater than 1, new number is not 0.

    // CAN LIKE: Number is 0

    var self = this;
    Global.socket.on('mass-like-status', function(msg) {
      console.log(msg);
      var left = Number(msg.left);

      var starting_number = Number( $('.js-mass-like-counter').text() );
      //console.log("mass-like-status notification received:" + left);

      if(isNaN(left)) {
        return;
      }

      if (starting_number > 0 && left === 0) {
        // COMPLETION STATE

        Global.likeInProgress = false;
        $('.js-mass-like-counter').text(left);

        self.uiSwap('liking');

      } else if (left > 0) {
        // IN PROGRESS
        Global.likeInProgress = true;

        $('.js-mass-like-counter').text(left);
        self.uiSwap('blocker');

      } else {
        // DEACTIVATED
        Global.likeInProgress = false;
        self.uiSwap('liking');
      }

    });
  };

  this.installObservers = function() {
    $('.matches').on('click', ".match-el", function(){
      if( !$('.match-hovercard').is(":visible") ) {
        var vague = $(this).Vague({
            intensity:      2,      // Blur Intensity
            forceSVGUrl:    false,   // Force absolute path to the SVG filter,
            // default animation options
            animationOptions: {
              duration: 1000,
              easing: 'linear' // here you can use also custom jQuery easing functions
            }
        });

        vague.blur();

        Like.matchRiver.queueOn = false;
        Like.activateMatchHovercard();

      }
    });

    var exit_hoverzones = '.nav, .rec-bar-wrap, .footer';

    $(".black-overlay").click(function() {
      if ( $('.match-hovercard').is(":visible") ) {
        $('.match-el').Vague().unblur();
        Like.matchRiver.queueOn = true;
        Like.deactivateMatchHovercard();
      }
    });

    var self = this;
    $('.js-like').click(function(){
      if(!Global.likeInProgress) {
        var amount = Number($(this).data('like-num'));
        var like_data = { "amount": amount };

        $('.js-mass-like-counter').text(amount);

        self.uiSwap('blocker');
        $.ajax({
          type: "POST",
          url: '/masslike',
          data: like_data,
          dataType: 'json',
          success: function(msg) {
            console.log(msg);
          }
        });

      }
    });
  };

  this.uiSwap = function(to_activate) {
    // to_activate: STR for "blocker" or "liking"

    var to_hide = $('.action');
    var to_show = $('.action-blocked');
    var show_slide_distance = 60;

    if(to_activate == 'liking') {
      to_hide = $('.action-blocked');
      to_show = $('.action');
      show_slide_distance = 20;
    }

    if($(to_show).is(":visible")) {
      return;
    }

    var animate_out = false;
    var activate_animation = function() {
      // make sure we dont animate out multiple times
      if(!animate_out) {
        animate_out = true;
      } else {
        return;
      }

      $(to_hide).hide();
      $(to_hide).css('transform','');

      $(to_show).css({
        'opacity':0,
        "y": "-=20px"
      }).show();

      $(to_show).transition({
        'opacity': 1,
        "y": "+="+show_slide_distance+"px"
      }, 1200);
    };

    $(to_hide).transition({
      'opacity': 0,
      "y": "+=40px",
      "complete": activate_animation
    }, 450);
  };

  this.setInitialLocation = function() {
    console.log(Global.currentCoords);
    var user_lat = Global.currentCoords.lat;
    var user_lon = Global.currentCoords.lon;

    console.log(user_lat);
    console.log(user_lon);
    var geocoder = new google.maps.Geocoder();

    var latlng = {lat: parseFloat(user_lat), lng: parseFloat(user_lon)};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          var city = results[2].formatted_address;

          $('#js-city-search').val(results[2].formatted_address);

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

  this.matchRiverStart = function(){
    var matchRiverParams = {
      parentObject: $('.match-river'),
      elementWrap: $('.match-river .matches'),
      elementClass: 'match-el',
      elementWidth: 120,
      transitionOutPx: 150
    };

    var matchHtml = function(insert_token) {
      var html1 = "<div class='match-el' style='";
      var html2 = html1+ "background-image:url(\""+insert_token+"\");'></div>";

      return html2;
    };

    var matchSocketParams = {
      channel: "new-match",
      html_func: matchHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic']
    };

    Like.matchRiver = new RiverUI();
    Like.matchRiver.init(matchRiverParams, matchSocketParams);
  };



  this.activateMatchHovercard = function(){
    $('.match-hovercard').css({
      'opacity':0,
      "y": "-=60px"
    }).show();

    $('.match-hovercard').transition({
      'opacity': 1,
      "y": "+=60px"
    }, 600);

    // $(blur_els).foggy({
    //   blurRadius: 5,
    //   opacity: .9
    // });

    var vague = $(Like.blurEls).Vague({
      intensity:      3,      // Blur Intensity
      forceSVGUrl:    false,   // Force absolute path to the SVG filter,
      // default animation options
      animationOptions: {
        duration: 1000,
        easing: 'linear' // here you can use also custom jQuery easing functions
      }
    });

    vague.blur();

    // $({blurRadius: 0}).animate({blurRadius: 15}, {
    //   duration: 1300,
    //   easing: 'swing', // or "linear"
    //                    // use jQuery UI or Easing plugin for more options
    //   step: function() {
    //     $(Like.blurEls).css({
    //       "-webkit-filter": "blur("+this.blurRadius+"px)",
    //       "filter": "blur("+this.blurRadius+"px)"
    //     });
    //   }
    // });

    setTimeout(function(){
      $('.black-overlay').hide().css('opacity', 0);
      $('.black-overlay').show().transition({
        "opacity": 0.45
      }, 700);
    }, 200);
  };

  this.deactivateMatchHovercard = function(){
    var self = this;
    $('.match-hovercard').transition({
      'opacity': 0,
      "y": "+=60px",
      "complete": function(){
        $('.match-hovercard').hide();
        $('.match-hovercard').css({
          'top': self.originalHovercardY,
          'transform': 0
        });
      }
    }, 600);


    // $(Like.blurEls).foggy({
    //   blurRadius: 5,
    //   opacity: .9
    // });

    // $({blurRadius: 10}).animate({blurRadius: 0}, {
    //   duration: 1300,
    //   easing: 'swing', // or "linear"
    //                    // use jQuery UI or Easing plugin for more options
    //   step: function() {
    //     $(Like.blurEls).css({
    //       "-webkit-filter": "blur("+this.blurRadius+"px)",
    //       "filter": "blur("+this.blurRadius+"px)"
    //     });
    //   }
    // });

    $(Like.blurEls).Vague({
      "duration": 800,
      "easing": 'swing'
    }).unblur();
    setTimeout(function(){
      $('.black-overlay').show().transition({
        "opacity": 0,
        "complete": function() {
          $('.black-overlay').hide();
        }
      }, 700);
    }, 200);
  };


  // ---------------------
  // ---------------------
  // ---------------------

  this.recommendationRiverStart = function() {
    var recRiverParams = {
      parentObject: $('.rec-river'),
      elementWrap: $('.rec-river .recommendations'),
      elementClass: 'rec-el',
      elementWidth: 80,
      transitionOutPx: 150
    };

    var recHtml = function(insert_token) {
      var html1 = "<div class='rec-el' style='";
      var html2 = html1+ "background-image:url(\""+insert_token+"\");'></div>";

      return html2;
    };

    var recSocketParams = {
      channel: "new-rec",
      html_func: recHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic']
    };

    Like.recRiver = new RiverUI();
    Like.recRiver.init(recRiverParams, recSocketParams);

  };
}

Like = new LikeClass();
