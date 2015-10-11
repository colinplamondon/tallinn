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
      self.renderConvo();
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
        var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
        function createMessage() {
          return {
            __html: messageExp
          };
        }
        return React.createElement(
          "div",
          { className: "matchCell row", match_id: this.props['match_id'], messaged: this.props['messaged'] },
          React.createElement("img", { className: "col-md-4", src: this.props['profile'] }),
          React.createElement(
            "div",
            { className: "col-md-8" },
            React.createElement(
              "span",
              { className: "name" },
              this.props['name']
            ),
            React.createElement(
              "span",
              { className: "lastonline" },
              "last online ",
              this.props['last_online']
            ),
            React.createElement("p", { dangerouslySetInnerHTML: createMessage() })
          )
        );
      }
    });

    var MatchList = React.createClass({
      displayName: "MatchList",

      render: function render() {
        var x = 0;
        var matchNodes = this.props.data.map(function (match) {
          x++;
          console.log(x);

          var last_three_messages = match['messages'].slice(-3);
          var messaged = true;
          if (match['messages'].length === 0) {
            messaged = false;
          }
          var last_online = moment(match.last_activity_date).fromNow();

          var messages_only = [];
          $.each(last_three_messages, function (idx, val) {
            messages_only.push(val['message']);
          });
          return React.createElement(MatchCell, { key: match._id,
            profile: match['person']['photos'][0]['url'],
            name: match['person']['name'],
            last_three_messages: messages_only.join('<br />'),
            messaged: messaged.toString(),
            last_online: last_online,
            match_id: match['_id'] });
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

  this.renderConvo = function () {
    var ConvoBox = React.renderClass({
      render: function render() {
        return React.createElement(
          "div",
          { className: "convoBox" },
          React.createElement(ConvoHistoryBox, { match: this.props.data })
        );
      }
    });

    var ConvoHistoryBox = React.renderClass({
      render: function render() {
        return React.createElement("div", { className: "convoHistoryBox" });
      }
    });

    var MessageBubble = React.renderClass({
      render: function render() {
        return React.createElement(
          "div",
          { className: "messageBubble" },
          React.createElement(
            "div",
            { className: "messageText" },
            this.props.message_text
          )
        );
      }
    });

    var active_match = this.historyData[0];
    ReactDOM.render(React.createElement(ConvoBox, { data: active_match }), document.getElementById('active-convo'));
  };

  this.getHistory = function (callback) {
    console.log('get history');
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': 6
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
