/*jshint multistr: true */
function LikeClass() {

  this.init = function() {
    this.locationSearch();
    this.installObservers();

    this.matchRiverStart();
    // this.recommendationRiverStart();
    if(Global.likeInProgress) {
      this.uiSwap('blocker');
    }
  };

    

  this.activateMatchHovercard = function(){
    var blur_els = $(".nav, .like-ui, .rec-bar-wrap, .footer");
    // $(blur_els).foggy({
    //   blurRadius: 5,
    //   opacity: .9
    // });

    $({blurRadius: 0}).animate({blurRadius: 15}, {
      duration: 1300,
      easing: 'swing', // or "linear"
                       // use jQuery UI or Easing plugin for more options
      step: function() {
        console.log(this.blurRadius);
        $(blur_els).css({
          "-webkit-filter": "blur("+this.blurRadius+"px)",
          "filter": "blur("+this.blurRadius+"px)"
        });
      }
    });

    setTimeout(function(){
      $('.black-overlay').hide().css('opacity', 0);
      $('.black-overlay').show().transition({
        "opacity": 0.45
      }, 700);
    }, 200);
  };

  this.installObservers = function() {
    $('.matches').on('mouseenter', ".match-el", function(){
        Like.matchRiver.queueOn = false;
    });

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
    var to_show = $('.action-blocked');

    if(to_activate == 'liking') {
      to_hide = $('.action-blocked');
      to_show = $('.action');
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
      $(to_show).css({
        'opacity':0,
        "y": "-=20px"
      }).show();

      $(to_show).transition({
        'opacity': 1,
        "y": "+=60px"
      }, 1200);
    };
    
    $(to_hide).transition({
      'opacity': 0,
      "y": "+=40px",
      "complete": activate_animation
    }, 450);
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
      var coord_long = place.geometry.location.L;

      Global.currentCoords = {
        "lat": coord_lat,
        "long": coord_long
      };      
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