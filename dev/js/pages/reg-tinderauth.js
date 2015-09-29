function TinderAuthClass() {
  this.init = function(){
    this.installObservers();
    this.bindAccessKeyBtns();
    this.bindSubmitBtn();
  };

	this.installObservers = function(){

	};

  this.bindAccessKeyBtns = function() {
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

  this.bindSubmitBtn = function() {

  };
}

TinderAuth = new TinderAuthClass();
