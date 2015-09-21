function GlobalClass() {
  this.init = function(){
    Global.installObservers();
		Pages.init();
	};

	this.installObservers = function(){

	};

	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

}

Global = new GlobalClass();
 /*jshint multistr: true */
function PagesClass() {
  this.init = function() {
    Pages.installObservers();
  };

  this.installObservers = function() {

  };

  this.preload_images = function(arrayOfImages) {
      $(arrayOfImages).each(function(){
          $('<img/>')[0].src = this;
          // Alternatively you could use:
          // (new Image()).src = this;
      });
  };


  this.getParameterByName = function(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

}
Pages = new PagesClass();
