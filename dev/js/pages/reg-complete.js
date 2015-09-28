function RegCompleteClass() {
  this.init = function(){
    this.installObservers();
    this.completeRegInit();
	};

	this.installObservers = function(){

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

}

RegComplete = new RegCompleteClass();
