/*jshint sub:true*/

"use strict";

function ChatClass() {
  this.url = "/chat";

  this.init = function () {
    console.log('chat init');
    this.installObservers();
    var self = this;
    this.getHistory(function (historyData) {
      console.log(historyData);
      self.historyData = historyData;
      self.createReact();
    });
  };

  this.createReact = function () {
    var MatchSidebar = React.createClass({
      displayName: "MatchSidebar",

      render: function render() {
        return React.createElement(
          "div",
          { className: "matchSidebar" },
          React.createElement(MatchList, { data: this.props.data })
        );
      }
    });

    // <img className="matchPic" src={match['person']['photos'][0]['url']}/>
    // <h3 className="matchName">{match['person']}</h3>

    var MatchCell = React.createClass({
      displayName: "MatchCell",

      render: function render() {
        return React.createElement(
          "div",
          { className: "matchCell" },
          React.createElement("img", { src: this.props.profile }),
          React.createElement(
            "span",
            null,
            this.props['name']
          )
        );
      }
    });

    var MatchList = React.createClass({
      displayName: "MatchList",

      render: function render() {
        var matchNodes = this.props.data.map(function (match) {
          console.log(match);
          console.log(match.person);
          console.log(match.person.photos);
          console.log(match.person.photos[0]);
          console.log(match.person.photos[0].url);

          return React.createElement(MatchCell, { key: match._id,
            profile: match['person']['photos'][0]['url'],
            name: match['person']['name'] });
        });
        return React.createElement(
          "div",
          { className: "matchList" },
          matchNodes
        );
      }
    });

    ReactDOM.render(React.createElement(MatchList, { data: this.historyData }), document.getElementById('match-list'));
  };

  this.getHistory = function (callback) {
    console.log('get history');
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': 4
      },
      dataType: 'json',
      success: function success(msg) {
        callback(msg.results);
      }
    });
  };

  this.installObservers = function () {};
}

var Chat = new ChatClass();

// MatchList
//   MatchCell
//# sourceMappingURL=chat.js.map
