/*jshint multistr: true */
function LikeClass() {

  this.init = function() {
    this.locationSearch();
    this.installObservers();

    if(Global.likeInProgress) {
      this.uiSwap('blocker');
    }
  };

  this.installObservers = function() {

    var self = this;
    $('.js-like').click(function(){
      var to_like = $(this).data('like-num');
      Global.likeInProgress = true;
      self.uiSwap('blocker');

    });
  };

  this.uiSwap = function(to_activate) {
    // to_activate: STR for "blocker" or "liking"

    var to_hide = $('.action');
    var to_show = $('.action-blocked')

    if(to_activate == 'liking') {
      to_hide = $('.action-blocked');
      to_show = $('.action')
      return
    } 

    var animate_out = false;
    var activate_animation = function() {
      // make sure we dont animate out multiple times
      if(!animate_out) {
        animate_out = true
      } else {
        return
      }

      $(to_show).css({
        'opacity':0,
        "y": "-=20px"
      }).show();

      $(to_show).transition({
        'opacity': 1,
        "y": "+=60px"
      }, 1200);
    }
    
    $(to_hide).transition({
      'opacity': 0,
      "y": "+=40px",
      "complete": activate_animation
    }, 450);


  }

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
        var message = "Nada, hombre.\n\nDid you enter a city name?"

        var city_error = $('.js-city-error');
        $(city_error).transition({'opacity':0}).show();
        $(city_error).html(message).transition({'opacity':1});


        return;
      }

      var coord_lat = place.geometry.location.H
      var coord_long = place.geometry.location.L

      Global.currentCoords = {
        "lat": coord_lat,
        "long": coord_long
      };      
    });
  };

  this.matchRiverStart = function(){
    var matchRiverParams = {
      parentObject: $('.match-bar'),
      elementWrap: $('.match-bar .matches'),
      elementClass: 'match-el',
      elementWidth: 120,
      transitionOutPx: 150
    }

    var matchHtml = function(insert_token) {
      var html1 = "<div class='match-el' style='"
      var html2 = html1+ "background-image:url(\""+insert_token+"\");'></div>"

      return html2
    }

    var matchSocketParams = {
      channel: "new-match",
      html_func: matchHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic'] 
    }
    matchRiver = new RiverUI();
    matchRiver.init(matchRiverParams, matchSocketParams);

  }

}
Like = new LikeClass();
