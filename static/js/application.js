// Foggy, v1.1.1
//
// Description: jQuery plugin for blurring page elements
// Homepage:    http://nbartlomiej.github.com/foggy
// Author:      nbartlomiej@gmail.com

(function( $ ){

  $.fn.foggy = function( options ) {
    var defaultOptions = {
      opacity:      0.8,
      blurRadius:   2,
      quality:      16,
      cssFilterSupport: true
    };

    var noBlurOptions = {
      opacity: 1,
      blurRadius: 0
    };

    var settings;
    if (options == false) {
       settings = $.extend( defaultOptions, noBlurOptions );
    } else {
       settings = $.extend( defaultOptions, options);
    }


    var BlurPass = function(content, position, offset, opacity){
      this.content = content;
      this.position = position;
      this.offset = offset;
      this.opacity = opacity;
    };

    BlurPass.prototype.render = function(target){
      $('<div/>', {
        html: this.content, 'class': 'foggy-pass-'+this.position
      }).css({
        position: this.position,
        opacity: this.opacity,
        top: this.offset[0],
        left: this.offset[1]
      }).appendTo(target);
    };

    var Circle = function(radius){
      this.radius = radius;
    };

    Circle.prototype.includes = function(x,y){
      if (Math.pow(x,2) + Math.pow(y,2) <= Math.pow(this.radius, 2)){
        return true;
      } else {
        return false;
      }
    };

    Circle.prototype.points = function(){
      var results = [];
      for (var x = -this.radius; x<=this.radius; x++){
        for (var y = -this.radius; y<=this.radius; y++){
          if (this.includes(x,y)){
            results.push([x,y]);
          }
        }
      }
      return results;
    };

    var ManualFog = function(element, settings){
      this.element = element;
      this.settings = settings;
    };

    ManualFog.prototype.calculateOffsets = function(radius, quality){
      var all_offsets = $.grep(
        new Circle(radius).points(),
        function(element){ return (element[0] != 0) || (element[1] != 0) }
      );
      var offsets;
      if (all_offsets.length <= quality){
        offsets = all_offsets;
      } else {
        var overhead = all_offsets.length - quality;
        var targets = [];
        for (var i = 0; i < overhead; i++){
          targets.push(Math.round(i * (all_offsets.length / overhead)));
        }
        offsets = $.grep( all_offsets, function(element, index){
          if ($.inArray(index, targets) >= 0){
            return false;
          } else {
            return true;
          }
        });
      }
      return offsets;
    };

    ManualFog.prototype.getContent = function(){
      var candidate = $(this.element).find('.foggy-pass-relative')[0];
      if (candidate){
        return $(candidate).html();
      } else {
        return $(this.element).html();
      }
    };

    ManualFog.prototype.render = function(){
      var content = this.getContent();
      $(this.element).empty();
      var wrapper = $('<div/>').css({ position: 'relative' });
      var offsets = this.calculateOffsets(
        this.settings.blurRadius*2, this.settings.quality
      );
      var opacity = (this.settings.opacity * 1.2) / (offsets.length + 1);
      new BlurPass(content, 'relative', [0,0], opacity).render(wrapper);
      $(offsets).each(function(index, offset){
        new BlurPass(content, 'absolute', offset, opacity).render(wrapper);
      });
      wrapper.appendTo(this.element);
    };

    var FilterFog = function(element, settings){
      this.element = element;
      this.settings = settings;
    }

    FilterFog.prototype.render = function(){
      var opacityPercent = (''+settings.opacity).slice(2,4);
      var filterBlurRadius = this.settings.blurRadius;
      $(this.element).css({
        '-webkit-filter': 'blur('+filterBlurRadius+'px)',
        opacity: settings.opacity
      });
    }

    return this.each(function(index, element) {
      if (settings.cssFilterSupport && '-webkit-filter' in document.body.style){
        new FilterFog(element, settings).render();
      } else {
        new ManualFog(element, settings).render();
      }
    });
  };

})( jQuery ); (function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t}); function GlobalClass() {
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

    setInterval(self.queueRunner, 1000);
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
    Socket.on( params.channel, function(msg){

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

} /*jshint multistr: true */
function LikeClass() {

  this.init = function() {
    this.locationSearch();
    this.installObservers();

    this.matchRiverStart();
    // this.recommendationRiverStart();
    if(Global.likeInProgress) {
      this.uiSwap('blocker');
    }
  };

    

  this.activateMatchHovercard = function(){
    var blur_els = $(".nav, .like-ui, .rec-bar-wrap, .footer");
    // $(blur_els).foggy({
    //   blurRadius: 5,
    //   opacity: .9
    // });

    $({blurRadius: 0}).animate({blurRadius: 15}, {
      duration: 1300,
      easing: 'swing', // or "linear"
                       // use jQuery UI or Easing plugin for more options
      step: function() {
        console.log(this.blurRadius);
        $(blur_els).css({
          "-webkit-filter": "blur("+this.blurRadius+"px)",
          "filter": "blur("+this.blurRadius+"px)"
        });
      }
    });

    setTimeout(function(){
      $('.black-overlay').hide().css('opacity', 0);
      $('.black-overlay').show().transition({
        "opacity": 0.45
      }, 700);
    }, 200);
  };

  this.installObservers = function() {
    $('.matches').on('mouseenter', ".match-el", function(){
        Like.matchRiver.queueOn = false;
    });

    var self = this;
    $('.js-like').click(function(){
      var to_like = $(this).data('like-num');
      Global.likeInProgress = true;
      self.uiSwap('blocker');

    });
  };

  this.uiSwap = function(to_activate) {
    // to_activate: STR for "blocker" or "liking"

    var to_hide = $('.action');
    var to_show = $('.action-blocked');

    if(to_activate == 'liking') {
      to_hide = $('.action-blocked');
      to_show = $('.action');
      return;
    } 

    var animate_out = false;
    var activate_animation = function() {
      // make sure we dont animate out multiple times
      if(!animate_out) {
        animate_out = true;
      } else {
        return;
      }

      $(to_hide).hide();
      $(to_show).css({
        'opacity':0,
        "y": "-=20px"
      }).show();

      $(to_show).transition({
        'opacity': 1,
        "y": "+=60px"
      }, 1200);
    };
    
    $(to_hide).transition({
      'opacity': 0,
      "y": "+=40px",
      "complete": activate_animation
    }, 450);
  };

  this.locationSearch = function() {
    var input = /** @type {!HTMLInputElement} */(
    document.getElementById('js-city-search'));

    var ac_options = {
      "types": ["(cities)"]
    };
    var autocomplete = new google.maps.places.Autocomplete(input, ac_options);
    var infowindow = new google.maps.InfoWindow();

    autocomplete.addListener('place_changed', function() {
      $('.js-city-error').transition({'opacity':0}).hide();

      infowindow.close();
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        var message = "Nada, hombre.\n\nDid you enter a city name?";

        var city_error = $('.js-city-error');
        $(city_error).transition({'opacity':0}).show();
        $(city_error).html(message).transition({'opacity':1});


        return;
      }

      var coord_lat = place.geometry.location.H;
      var coord_long = place.geometry.location.L;

      Global.currentCoords = {
        "lat": coord_lat,
        "long": coord_long
      };      
    });
  };

  this.matchRiverStart = function(){
    var matchRiverParams = {
      parentObject: $('.match-river'),
      elementWrap: $('.match-river .matches'),
      elementClass: 'match-el',
      elementWidth: 120,
      transitionOutPx: 150
    };

    var matchHtml = function(insert_token) {
      var html1 = "<div class='match-el' style='";
      var html2 = html1+ "background-image:url(\""+insert_token+"\");'></div>";

      return html2;
    };

    var matchSocketParams = {
      channel: "new-match",
      html_func: matchHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic'] 
    };

    Like.matchRiver = new RiverUI();
    Like.matchRiver.init(matchRiverParams, matchSocketParams);
  };

  // ---------------------
  // ---------------------
  // ---------------------

  this.recommendationRiverStart = function() {
    var recRiverParams = {
      parentObject: $('.rec-river'),
      elementWrap: $('.rec-river .recommendations'),
      elementClass: 'rec-el',
      elementWidth: 80,
      transitionOutPx: 150
    };

    var recHtml = function(insert_token) {
      var html1 = "<div class='rec-el' style='";
      var html2 = html1+ "background-image:url(\""+insert_token+"\");'></div>";

      return html2;
    };

    var recSocketParams = {
      channel: "new-rec",
      html_func: recHtml,
      tokens_from_msg: ['profile-pic'],
      img_preload_array: ['profile-pic'] 
    };

    Like.recRiver = new RiverUI();
    Like.recRiver.init(recRiverParams, recSocketParams);

  };
}

Like = new LikeClass(); /*jshint multistr: true */
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
