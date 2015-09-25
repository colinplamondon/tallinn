// Disabling warning for Don't make functions within a loop.
/*jshint -W083 */

function RiverUI() {

  // riverParams: DICT with:
    // parentObject: JQUERY OBJECT, the element containing the entire river zone.
    // elementWrap: JQUERY OBJECT, the wrapper WITHIN parent_object to contain
      // appended elements.
    // elementClass: STR, for desired class to identify each appended element
    // by
    // elementWidth: INT, width of each element, in pixels
    // transitionOutPx: INT, number of pixels to transition items being deleted
    // by

  // socketioParams: DICT with:
    // "channel", STR for channel to listen to
    // "html": DICT the Jquery element construction
        // {
        //    'class':'match-el',
        //    'style':'background-image:url("'+profile_pic+'");',
        // }
    // "img_preload_array": optional, ARRAY of image url strings to preload.

  this.init = function(riverParams, socketioParams) {

    this.elementQueue = [];
    console.log(this.elementQueue);
    this.queueOn = true;

    this.parentObject = riverParams.parentObject;
    this.elementWrap = riverParams.elementWrap;
    this.elementClass = riverParams.elementClass;
    this.elementWidth = riverParams.elementWidth;
    this.transitionOutPx = riverParams.transitionOutPx;

    this.maxElements = this.returnMaxElementsInRow();

    this.installWatchers(socketioParams);
    this.installObservers();

    var self = this;
    self.queueJob = setInterval(function(){
      self.queueRunner(self);
    },1000);
  };

  this.returnMaxElementsInRow = function() {
    var viewport_width = $(window).width();
    var bar_width = $(this.parentObject).width();

    var bar_left_offset = $(this.parentObject).offset().left;

    var max_elements = Math.floor( bar_width / this.elementWidth );
    return max_elements;
  };

  this.queueRunner = function(self) {
    var q_length = self.elementQueue.length;
    $('.js-queue-length').html(q_length);
    $('.js-queue-state').html(self.queueOn);
    if( self.queueOn && self.elementQueue.length > 0) {
      self.addNextElement();
    }
  };

  this.addNextElement = function() {
    var next = $( this.elementQueue.shift() );

    var element_num = $("."+this.elementClass).length;

    if ( $("."+this.elementClass).length >= this.maxElements ) {
      var to_delete = element_num - this.maxElements;
      var count = 1;

      while ( count < to_delete  ) {
        count++;
        element_num = $("."+this.elementClass).length;
        var target = $("."+this.elementClass).first();
        // $(target).transition({ 'x': -300})
        $(target).transition({
          'left': "-="+this.transitionOutPx,
          "opacity": 0
        });

        setTimeout(function(){
            $(target).remove();
        }, 500);

        var self = this;
        $("."+this.elementClass).each(function(idx, el){
          $(el).transition({'x':"-="+self.elementWidth});
        });
      }
    }

    var css = $(next).attr('style');
    var hide_location = $(window).width() + this.elementWidth;

    var element_offset = (element_num * this.elementWidth);
    var animation_distance = (hide_location - element_offset) * -1;
    var addition = css+'left:'+hide_location+'px;';

    $(next).attr('style', addition);

    // TODO: should pass in ID explicitly, otherwise default to an ObjectID
    $(next).attr('id', Global.getRandomInt(1, 1000));
    var new_element = $(next).appendTo(this.elementWrap);

    setTimeout(function(){
      $(new_element).transition({'x':animation_distance});
    }, 250);
  };

  this.installWatchers = function(params) {
    var self = this;
    Global.socket.on( params.channel, function(msg){

      if ( params.hasOwnProperty('img_preload_array') ) {

        // Using the token in the img_preload array, load
        // the image we want from the msg
        $.each( params.img_preload_array, function(e){
          Global.preloadImages( msg[e] );
        });
      }

      var html = params.html_func( msg.profile_pic );

      self.elementQueue.push(html);
    });
  };

  this.installObservers = function() {
    var self = this;
    $(window).resize(function(){
        this.maxElements = self.returnMaxElementsInRow();
    });

  };

}
