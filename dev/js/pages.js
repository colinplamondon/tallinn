/*jshint multistr: true */
function PagesClass() {
  this.init = function() {
    Pages.installObservers();
    Pages.router();
  };

  this.router = function() {
    // -----------------------------------
    // -----------------------------------
    // ABOUT PAGE
    // TODO: we have to do something smarter than this.

    if (window.location.pathname.indexOf("/reg") > -1) {
        this.regInit();
    }

    if (window.location.pathname.indexOf("/complete-reg") > -1) {
      this.completeRegInit();
    }
  };

  this.installObservers = function() {

  };

  this.fbCheckLoginResponse = function(resp) {
    console.log('statusChangeCallback');
    console.log(resp);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (resp.status === 'connected') {
      // Logged into your app and Facebook.
      var token = resp.authResponse.accessToken;
      var userId = resp.authResponse.userID;
      var email = $('.js-reg-email').val();

      window.location.href = '/complete-reg?email='+email+'&fbToken='+token+'&fbUser='+userId;
      //relative to domain
    } else if (resp.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      alert('Please log into this app.');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      alert('Please log into Facebook.');
    }

  };


  this.regEmailOk = function() {
    $('.fb-login').removeClass('disabled');
    $('.email-input').addClass('disabled');

    var self = this;
    $('.js-fb-login').click(function(){
       FB.login(function(response) {
         // handle the response
         self.fbCheckLoginResponse(response);
       }, {scope: 'public_profile,email'});
    });
  };


  this.completeRegInit = function() {
    $('.js-get-access-key').click(function(){
      $('.js-get-access-key').transition({
        "opacity":0.7,
        "background-color": "#0C62C8"
      });

      $('.js-paste-tinder-token').removeAttr('disabled').css({
        "border":"1px solid #ffffff",
        "color": "#ffffff"
      }).addClass('active');

      $('.paste-token').removeClass('disabled').transition();
      $('.paste-token label').addClass('lookatme');
    });

    $('.js-submit-tinderkey').click(function(){
      var tinder_token = $('.js-paste-tinder-token').val();
      var email = Global.getParameterByName('email');
      var facebookId = Global.getParameterByName('fbUser');

      var login_data = {
        'email': email,
        'token': tinder_token,
        'fbid': facebookId,
      };

      function submitForm(loginData, btn) {
        $.ajax({
          type: "POST",
          url: '/login',
          data: login_data,
          dataType: 'json',
          success: function(msg) {
            console.log(msg);
            if(msg.ok) {
              $(btn).find('.submitting').transition({
                'opacity':0
              }, 200, function(){
                $(btn).find('.success').css('opacity',0).show();
                $(btn).find('.submitting').hide();
                $(btn).find('.success').transition({
                  opacity: 1
                }, 300, function(){
                  setTimeout(function(){
                    // alert('redirect!');
                    window.location.href = msg.redirect;
                  }, 600);
                });
              });
            } else {
              alert(msg.msg);
            }
          }
        });
      }
      var should_submit = false;

      var btn = this;
      $(btn).find('.unsubmitted').transition({
        'opacity': 0
      }, 300,function() {
        $(this).hide();
        $(btn).find('.submitting').css('opacity', 0).show().transition({
          'opacity': 1
        }, 200, function(){
          // ANIMATION COMPLETE
          submitForm(login_data, btn);

        });
      });
    });
  };

  this.regInit = function() {
    var validations ={
      email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Please enter a valid email address']
    };

    var self = this;

    Pages.regAnimationBool = false;

    $('.js-fb-login').bind('click', function(){
      alert('Please enter your email, first.');
      $('.js-fb-login').focus();
      return false;
    });

    // Check all the input fields of type email. This function will handle all the email addresses validations
    $(".js-reg-email").keyup( function(){
      // Set the regular expression to validate the email
      validation = new RegExp(validations.email[0]);
      // validate the email value against the regular expression
      if (!validation.test(this.value)){
        // If the validation fails then we show the custom error message
        $('.js-email-error').html( validations.email[1] );
        return false;
      } else {
        setTimeout(function(){
          if (!Pages.regAnimationBool) {
            Pages.regAnimationBool = true;
              // This is really important. If the validation is successful you need to reset the custom error message
            $('.js-email-error').html('');
            $('.js-reg-email').transition({
              "background-color": "#3CE2B4"
            }, 600).transition({
              "background-color": "#4A90E2"
            }, 400, function(){
              setTimeout(function(){
                Pages.regAnimationBool = true;

                $('js-reg-email').addClass('passed-validation');
                $('.js-fb-login').unbind();
                self.regEmailOk();
              },150);
            });
          }
        });
      }
    });


  };

}
Pages = new PagesClass();
