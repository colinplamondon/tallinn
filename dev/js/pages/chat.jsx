/*jshint sub:true*/
/*jshint -W030 */

// ChatUI
//   MatchList
//     MatchCell
//   ActiveConvo
//     ConvoHistoryBox
//       MessageBubble
//     MessageInput
//   ConvoPhotos

function ChatClass() {
  this.url = "/chat";
  this.init = function(){
    this.installObservers();

    ReactDOM.render(
      React.createElement(NavBoxes, {"page":"chat"}),
      document.getElementById('js-nav-react')
    );

    ReactDOM.render(React.createElement(WingmanApp, {"page":"chat"} ,
    	document.getElementById('react-hook')));
	};

	this.installObservers = function(){
	};

}

var Chat = new ChatClass();