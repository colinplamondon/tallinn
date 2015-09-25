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
      Like.init();

      if (window.location.pathname.indexOf("/reg") > -1) {
          this.regInit();
      }

      if (window.location.pathname.indexOf("/complete-reg") > -1) {
        this.completeRegInit();
      }
    };

  this.installObservers = function() {

  };

  this.getParameterByName = function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
      window.location.href = '/complete-reg'; 
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
              },300);
            });
          }
        });
      }
    });


  };

}
Pages = new PagesClass();
