function RegCompleteClass() {
  this.init = function(){
    this.installObservers();
    this.emailWatcher();
    this.submitRegWatch();
	};

	this.installObservers = function(){

	};

	this.regEmailOk = function() {
		$('.gif-directions').removeClass('disabled');
    $('.access-key').removeClass('disabled');
		$('.email-input').addClass('disabled');

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

    $('.js-paste-tinder-token').on('paste', function(){
      // on paste fires upon control-v, NOT the actual
      // paste being in the input...
      setTimeout(function(){
        $('.lookatme').removeClass('lookatme');
        $('.submit-form').removeClass('disabled');
      }, 150);
    });
	};

	this.emailWatcher = function() {
	 	var validations ={
      email: [/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/, 'Please enter a valid email address']
    };

    var self = this;
    this.regAnimationBool = false;

    $('.js-get-access-key').bind('click', function(){
      alert('Please enter your email, first.');
      $('.js-reg-email').select();
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
      }
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

              $('.js-reg-email').addClass('passed-validation');
              $('.js-get-access-key').unbind();
              self.regEmailOk();
            },150);
          });
        }
      });
    });
	};

	this.submitRegWatch = function() {
		$('.js-submit-tinderkey').click(function(){
		  var tinder_token = $('.js-paste-tinder-token').val();
		  var email = $('.js-reg-email').val();
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

}

RegComplete = new RegCompleteClass();
