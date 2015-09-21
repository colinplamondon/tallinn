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
