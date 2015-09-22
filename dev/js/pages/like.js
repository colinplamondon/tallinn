/*jshint multistr: true */
function LikeClass() {
  this.matchQueue = [];
  this.matchQueueOn = false;
  this.matchElWidth = 120;

  this.deleteTest = true;

  this.init = function() {
  	Like.installWatchers();
    Like.maxMatchesInRow = Like.returnMaxMatchesInRow();
  };

  this.returnMaxMatchesInRow = function() {
    var viewport_width = $(window).width();
    var bar_width = $('.match-bar').width();
    var bar_left_offset = $('.match-bar').offset().left;

    var max_matches = Math.floor( bar_width / Like.matchElWidth );
    return max_matches;
  };

  this.addNextMatch = function() {
    var next = Like.matchQueue.shift();
    console.log('adding next: ' + next)

    // var css = $(next).attr('style');
    // var addition = css+'left:'+left_offset+'px;';
    // var addition = css+'left:0px;';
    // $(next).attr('style', addition)

    // $('.match-bar .matches').append(next).addClass('animate-in');

    var match_num = $('.match-el').length;
    console.log("match num: "+match_num);
    console.log('max matches: '+Like.maxMatchesInRow)
    
    if ( $('.match-el').length >= Like.maxMatchesInRow ) {
      var to_delete = match_num - this.maxMatchesInRow;
      console.log("number to delete: " + to_delete);
      var count = 1;

      while ( count < to_delete  ) {
        console.log("current count: " + count)
        count++;
        match_num = $('.match-el').length;
        var target = $('.match-el').first();
        console.log(target);
        // $(target).transition({ 'x': -300})
        $(target).transition({
          'left': "-="+150,
          "opacity": 0
        });

        setTimeout(function(){
            $(target).remove();
        }, 500);
        $('.match-el').each(function(idx){
          // $(this).css({'left': target_position});
          $(this).transition({'x':"-="+Like.matchElWidth});
          // $(this).css({ translate: [-Like.matchElWidth,0] });
        });
      }

    };


    var css = $(next).attr('style');
    var hide_location = $(window).width() + Like.matchElWidth;

    var match_offset = (match_num * Like.matchElWidth);
    var animation_distance = (hide_location - match_offset) * -1;
    var addition = css+'left:'+hide_location+'px;';

    $(next).attr('style', addition);
    $(next).attr('id', Global.getRandomInt(1, 1000));
    var new_match = $(next).appendTo('.match-bar .matches');

    setTimeout(function(){
      $(new_match).transition({'x':animation_distance});
    }, 250);

    if(Like.matchQueue.length) {
      setTimeout(Like.addNextMatch, 1000);
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
        Like.addNextMatch();
      }

  	});
  };


  this.find_matches = function() {

  };


  this.installObservers = function() {
    $(window).resize(function(){
        Like.maxMatchesInRow = Like.returnMaxMatchesInRow();
    });
    
  };

}
Like = new LikeClass();
