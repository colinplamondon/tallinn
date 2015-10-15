function RegCompleteClass() {
  this.init = function(){
    this.installObservers();
    this.emailWatcher();
    this.submitRegWatch();
    this.emailPassed = false;
    $('.gif-directions').addClass('disabled');
    $('.access-key').addClass('disabled');
    $('.paste-token').addClass('disabled');
	};

	this.installObservers = function(){

	};

	this.regEmailOk = function() {
		$('.gif-directions').removeClass('disabled');
    $('.access-key').removeClass('disabled');
		$('.email-input').addClass('disabled');
    $('.js-get-access-key').removeClass('inactive');

    TinderAuth.bindAccessKeyBtns();
	};

  this.emailValidation = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

	this.emailWatcher = function() {
    var self = this;
    var validation = new RegExp(this.emailValidation);
    console.log(validation);
    this.regAnimationBool = false;

    $('.js-get-access-key').bind('click', function(){
      alert('Please enter your email, first.');
      $('.js-reg-email').select();
      return false;
    });

    // Check all the input fields of type email. This function will handle all the email addresses validations
    $(".js-reg-email").keyup( function(){
      console.log(this.value);
      // Set the regular expression to validate the email
      // validate the email value against the regular expression
      console.log(validation.test(this.value));
      if (!validation.test(this.value)){
        // If the validation fails then we show the custom error message
        console.log('failed');
        $('.js-reg-email').removeClass('passed');
        $('.js-email-error').html( "Please check your email address." );
        if(self.emailPassed) {
          console.log('remove class');
          $('.email-input').removeClass('disabled');
        }
        return;
      }

      self.emailPassed = true;
      $('.js-reg-email').addClass('passed');
      self.regEmailOk();

      if (!$('.access-key').hasClass('disabled')) {
        self.activateTinderToken();
      }
    });
	};

  this.activateTinderToken = function(){
    var self = this;
    setTimeout(function(){
      if (!self.regAnimationBool) {
        self.regAnimationBool = true;
          // This is really important. If the validation is successful you need to reset the custom error message
        $('.js-email-error').html('');
        $('.js-reg-email').transition({
          "background-color": "#3CE2B4"
        }, 600).transition({
          "background-color": "#4A90E2"
        }, 400, function(){
          setTimeout(function(){
            self.regAnimationBool = true;

            $('.js-get-access-key').unbind();
            self.regEmailOk();
          },150);
        });
      }
    });

  };

	this.submitRegWatch = function() {
    var self = this;
		$('.js-submit-tinderkey').click(function(){

      if($('.submit-form').hasClass('disabled')){
        return;
      }

      if (!$('.js-reg-email').hasClass('passed')) {
        alert("Check your email real quick - looks like it's invalid.");
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return;
      }

		  var tinder_token = $('.js-paste-tinder-token').val();
		  var facebookId = Global.getParameterByName('fbUser');
      var email = $('.js-reg-email').val();

		  var login_data = {
		    'email': email,
		    'token': tinder_token,
		  };

		  function submitForm(loginData, btn) {
		    $.ajax({
		      type: "POST",
		      url: '/complete-reg',
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
		                window.location.href = "/";
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

}

RegComplete = new RegCompleteClass();
