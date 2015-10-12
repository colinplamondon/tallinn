/*jshint sub:true*/
/*jshint -W030 */

"use strict";

function ChatClass() {
  this.url = "/chat";
  this.historyMaxDaysBack = 20;
  this.init = function () {
    this.installObservers();
    this.createReact();
  };

  this.sortByDateProp = function (target_list, prop) {
    return target_list.sort(function (a, b) {
      return Date.parse(b[prop]) - Date.parse(a[prop]);
    });
  };

  this.createReact = function () {
    var self = this;

    var MatchSidebar = React.createClass({
      displayName: "MatchSidebar",

      loadUpdates: function loadUpdates() {
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'timestamp': self.initialFetch
          },
          dataType: 'json',
          success: (function (msg) {
            var timestamp = msg.timestamp;
            var historyData = self.sortByDateProp(msg.results, 'last_activity_date');

            this.setState({ data: historyData });
            self.lastFetch = timestamp;
          }).bind(this),
          error: (function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }).bind(this)
        });
      },
      getInitialState: function getInitialState() {
        return { data: [] };
      },
      historyLooper: function historyLooper(callback) {
        var lookup = {
          "3": 7,
          "7": 14,
          "14": 20
        };

        var current_history = parseInt(self.lastDayFetch);
        var next = lookup[current_history];
        alert('next is ' + next);

        if (next == 20) {
          alert('start interval');
          setInterval(this.loadUpdates, 5000);
        }

        this.collectHistory(next, function () {
          callback();
        });
      },
      collectHistory: function collectHistory(days_back, callback) {
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'days_ago': parseInt(days_back)
          },
          dataType: 'json',
          success: (function (msg) {
            var timestamp = msg.timestamp;
            var historyData = self.sortByDateProp(msg.results, 'last_activity_date');

            self.lastFetch = timestamp;
            self.initialFetch = timestamp;
            self.lastDayFetch = days_back;
            this.setState({ data: historyData });
          }).bind(this),
          error: (function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }).bind(this)
        });
      },
      componentDidMount: function componentDidMount() {
        alert('mounted.');
        console.log('mounted');
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'days_ago': 3
          },
          dataType: 'json',
          success: (function (msg) {
            var timestamp = msg.timestamp;
            var historyData = msg.results;

            self.lastFetch = timestamp;
            self.initialFetch = timestamp;
            self.lastDayFetch = 3;
            this.setState({ data: historyData });

            var activereact = this;
            function loop() {
              console.log("last day fetch: " + self.lastDayFetch);
              console.log("history days back: " + self.historyMaxDaysBack);
              if (self.lastDayFetch < self.historyMaxDaysBack) {
                activereact.historyLooper(function () {
                  loop();
                });
              }
            }
            loop();

            console.log("NOW SETTING UPDATE INTERVAL");
          }).bind(this),
          error: (function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }).bind(this)
        });
      },
      render: function render() {
        console.log('rendering...');
        return React.createElement(
          "div",
          { className: "matchSidebar" },
          React.createElement(MatchList, { data: this.state.data })
        );
      }
    });

    var MatchList = React.createClass({
      displayName: "MatchList",

      render: function render() {
        var matchNodes = this.props.data.map(function (match) {
          var last_three_messages = match['messages'].slice(-3);
          var messaged = true;
          if (match['messages'].length === 0) {
            messaged = false;
          }
          var last_messaged = moment(match.last_activity_date).fromNow();
          var last_online = moment(match.person.ping_time).fromNow();

          var messages_only = [];
          $.each(last_three_messages, function (idx, val) {
            messages_only.push(val['message']);
          });
          return React.createElement(MatchCell, { key: match._id,
            profile: match['person']['photos'][0]['url'],
            name: match['person']['name'],
            last_three_messages: messages_only.join('<br />'),
            messaged: messaged.toString(),
            last_messaged: last_messaged,
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

    ReactDOM.render(React.createElement(MatchSidebar, { data: this.historyData }), document.getElementById('match-list'));
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

  this.getUpdates = function (timestamp, callback) {
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'timestamp': timestamp
      },
      dataType: 'json',
      success: function success(msg) {
        callback(msg.results, msg.timestamp);
      }
    });
  };

  this.getHistory = function (days_ago, callback) {
    console.log('get history');
    $.ajax({
      type: "POST",
      url: '/get_history',
      data: {
        'days_ago': days_ago
      },
      dataType: 'json',
      success: function success(msg) {
        callback(msg.results, msg.timestamp);
      }
    });
  };

  this.installObservers = function () {};
}

var Chat = new ChatClass();

// MatchList
//   MatchCell
//# sourceMappingURL=chat.js.map
