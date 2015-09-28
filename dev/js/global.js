function GlobalClass() {
  this.init = function(){
    Global.installObservers();
	};

	this.installObservers = function(){

	};

	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

  this.preloadImages = function(arrayOfImages) {
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

Global = new GlobalClass();
