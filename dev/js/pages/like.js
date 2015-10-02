/*jshint multistr: true */
function LikeClass() {
  this.url = "/";
  this.init = function() {
    this.originalHovercardY = $('.match-hovercard').css('top');
    this.blurEls = $(".nav, .like-ui, .rec-bar-wrap, .footer");

    this.installObservers();
    this.installWatchers();

    this.matchRiverStart();
    this.recommendationRiverStart();

    this.introsOn = true;
    if(this.introsOn) {
      $('.js-intro-switch').prop('checked', true);
      this.activateIntros();
    } else {
      this.deactivateIntros();
      $('.js-intro-switch').prop('checked', false);
    }
  };

  this.installWatchers = function() {
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

  this.fillHovercardFromData = function(data) {
    var eraseElements = [$('.js-match-name'), $('.js-miles-away'),$('.js-last-online'), $('.js-hovercard-bio'), $('.js-hovercard-photos')];
    $.each(eraseElements, function(idx, val){
      $(this).html('');
    });

    $('.js-match-name').html(data.name);
    $('.js-miles-away').html(data.distance);
    $('.js-last-online').html(data.last_online);
    $('.js-hovercard-bio').html(data.bio);
    $('.js-match-age').text(data.age);
    $('.match-hovercard .js-unmatch').data('target-match', data.id);

    $.each(data.large_photos, function(idx, val){
      $('.js-hovercard-photos').append("<img src='"+val+"' />");
    });
  };

  this.installObservers = function() {
    var self = this;
    $('.matches').on('click', ".match-el", function(){
      var match_id = $(this).attr('id');
      var match_data = self.matchRiver.elementInfo[match_id];
      self.fillHovercardFromData( match_data );
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

    $('.js-like').click(function(){
      if(!Global.likeInProgress) {
        var amount = Number($(this).data('like-num'));
        $('.js-mass-like-counter').text(amount);

        var intro = false;
        if(Like.introsOn) {
          intro = $('.js-intro-input').val();
        }

        var like_data = {
          "amount": amount,
          "intro": intro
        };

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

    $('.js-like-num-el').click(function(){
      var target_num = $(this).data('num');
      $('.like-num-el').removeClass('active');
      $(this).addClass('active');

      $('.js-like').data('like-num', target_num);
      $('.js-swipe-num').text(target_num);
    });

    $('.js-intro-switch').on('change', function(){
      var state = $(this).prop('checked');
      if(state === true) {
        self.activateIntros();
      } else {
        // false
        self.deactivateIntros();
      }
    });
  };

  this.activateIntros = function() {
    $('.js-switch-bar').removeClass('off').addClass('on');
    $('.js-intro-message-status').text('on');
    $('.js-if-intros-on').addClass('active');
    $('.js-intro-input').prop('disabled', false);
    this.introsOn = true;

    $('.js-add-intro-token').bind('click', function(){
      var token = $(this).data('token');
      console.log(token);
      var target = $(this).data('target-area');
      console.log(target);
      Global.insertAtCaret(target, token);
      return false;
    });
  };
  this.deactivateIntros = function() {
    $('.js-switch-bar').removeClass('on').addClass('off');
    $('.js-intro-message-status').text('off');
    $('.js-if-intros-on').removeClass('active');
    $('.js-intro-input').prop('disabled', true);
    this.introsOn = false;

    $('.js-add-intro-token').unbind();
  };

  this.uiSwap = function(to_activate) {
    // to_activate: STR for "blocker" or "liking"

    var to_hide = $('.js-masslike-intro');
    var to_show = $('.js-masslike-blocked');
    var show_slide_distance = 60;

    if(to_activate == 'liking') {
      to_hide = $('.js-masslike-blocked');
      to_show = $('.js-masslike-intro');
      show_slide_distance = 100;
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
        "x": "-=20px"
      }).show();

      $(to_show).transition({
        'opacity': 1,
        "x": "+="+show_slide_distance+"px"
      }, 1200);
    };

    $(to_hide).transition({
      'opacity': 0,
      "x": "+=40px",
      "complete": activate_animation
    }, 450);
  };


  this.matchRiverStart = function(){
    var matchRiverParams = {
      parentObject: $('.match-river'),
      elementWrap: $('.match-river .matches'),
      elementClass: 'match-el',
      elementWidth: 120,
      transitionOutPx: 150
    };

    var matchHtml = function(tokens) {
      var html1 = "<div id='"+tokens[0]+"' class='match-el' style='";
      var html2 = html1+ "background-image:url(\""+tokens[1]+"\");'></div>";

      return html2;
    };

    var photosToLoad = ['large_photos'];

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

  this.testData1 = {
    "bio": "",
    "id": "55cb8de4c31219c85f5d620a",
    "large_photos": [
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/640x640_bcd6bd1f-d8e6-4a1b-b4e2-376908f6558a.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/640x640_6b71a8fb-5d0f-476d-89fb-437ae8695301.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/640x640_62bc9574-134c-4129-858f-0a5b4ffd6465.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/640x640_ca5f7895-17f9-43bb-8a9b-09b71f995d46.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/640x640_edd57868-7c15-4d21-8b0d-4c9457160756.jpg"
    ],
    "last_online": "43 minutes ago",
    "miles_away": 12,
    "name": "Elina",
    "photos": [
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/320x320_bcd6bd1f-d8e6-4a1b-b4e2-376908f6558a.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/320x320_6b71a8fb-5d0f-476d-89fb-437ae8695301.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/320x320_62bc9574-134c-4129-858f-0a5b4ffd6465.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/320x320_ca5f7895-17f9-43bb-8a9b-09b71f995d46.jpg",
      "http://images.gotinder.com/55cb8de4c31219c85f5d620a/320x320_edd57868-7c15-4d21-8b0d-4c9457160756.jpg"
    ]
  };

  this.testData2 = {
    "bio": "178 cm.",
    "id": "545e7ba5b014ddb879ebfcb4",
    "large_photos": [
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_331ac626-b293-48e1-8db1-b552243402b6.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_f5210d8a-f81e-4220-85a7-66f33e6233b5.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_4c33db1c-10a1-467d-8c32-45c9accab42d.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_55498925-6b1c-44b3-98bb-9738acd32446.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_af244d2a-1def-4e16-88eb-95b63b65de63.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/640x640_71caddd1-6e87-4e64-9d07-ea8e5f220f87.jpg"
    ],
    "last_online": "a day ago",
    "miles_away": 6,
    "name": "Alla",
    "photos": [
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_331ac626-b293-48e1-8db1-b552243402b6.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_f5210d8a-f81e-4220-85a7-66f33e6233b5.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_4c33db1c-10a1-467d-8c32-45c9accab42d.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_55498925-6b1c-44b3-98bb-9738acd32446.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_af244d2a-1def-4e16-88eb-95b63b65de63.jpg",
      "http://images.gotinder.com/545e7ba5b014ddb879ebfcb4/320x320_71caddd1-6e87-4e64-9d07-ea8e5f220f87.jpg"
    ]
  };

  this.recommendationRiverStart = function() {
    var recRiverParams = {
      parentObject: $('.rec-river'),
      elementWrap: $('.rec-river .recommendations'),
      elementClass: 'rec-el',
      elementWidth: 80,
      transitionOutPx: 150
    };

    var recHtml = function(tokens) {
      var html1 = "<div id='"+tokens[0]+"' class='rec-el' style='";
      var html2 = html1+ "background-image:url(\""+tokens[1]+"\");'></div>";

      return html2;
    };

    var recSocketParams = {
      channel: "new-unrequited",
      token_num: 2,
      html_func: recHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic']
    };

    Like.recRiver = new RiverUI();
    Like.recRiver.init(recRiverParams, recSocketParams);

  };
}

Like = new LikeClass();
