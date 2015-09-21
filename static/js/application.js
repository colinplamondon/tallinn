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

  this.preloadImages = function(arrayOfImages) {
      $(arrayOfImages).each(function(){
          $('<img/>')[0].src = this;
          // Alternatively you could use:
          // (new Image()).src = this;
      });
  };

}

Global = new GlobalClass();
 /*jshint multistr: true */
function LikeClass() {
  this.init = function() {
  	Like.installWatchers();
  };

  this.matchQueue = [];
  this.matchQueueOn = false;
  
  this.addNextMatch = function() {
    var next = Like.matchQueue.shift();
    console.log('adding next: ' + next)
    var left_offset = $('.matches').offset().left + 120

    var css = $(next).attr('style');
    var addition = css+'left:'+left_offset+'px;';
    $(next).attr('style', addition)

    $('.match-bar .matches').append(next);

    if(Like.matchQueue.length) {
      setTimeout(Like.addNextMatch, 5000);
    } else {
      Like.matchQueueOn = false;
    };
  }

  this.determineLeftPosition = function(){
  };

  this.installWatchers = function() {
  	Socket.on('new-match', function(msg){
  		var profile_pic = msg['profile_pic'];

  		Global.preloadImages([profile_pic]);

      var html = $('<div/>', {
          'class':'match-el',
          'style':'background-image:url("'+profile_pic+'");',
      })
      console.log(html);
      Like.matchQueue.push(html);

      console.log(Like.matchQueue);

      if(!Like.matchQueueOn) {
        Like.matchQueueOn = true;
        // Like.addNextMatch();
      }

  	});
  };


  this.find_matches = function() {

  };


  this.installObservers = function() {
  };

}
Like = new LikeClass();
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
      if (window.location.pathname.indexOf("/like") > -1) {
          Like.init();
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

}
Pages = new PagesClass();
 /*jshint multistr: true */
function SubpagesClass() {
  this.init = function() {

  };


  this.installObservers = function() {
  };

}
Subpages = new SubpagesClass();
