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

"use strict";

function ChatClass() {
  this.url = "/chat";
  this.historyMaxDaysBack = 14;
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

    var ChatUI = React.createClass({
      displayName: "ChatUI",

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
        return {
          data: [],
          convo: {
            "_id": "",
            'messages': [{ 'from': '', 'message': '' }]
          }
        };
      },
      historyLooper: function historyLooper(callback) {
        var lookup = {
          "3": 7,
          "7": 14,
          "14": 20
        };

        var current_history = parseInt(self.lastDayFetch);
        var next = lookup[current_history];

        if (next == 20) {
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

            if (self.activeConvoNotSet) {
              var currentreact = this;
              $.each(historyData, function (idx, val) {
                if (val.messages.length > 0) {
                  self.activeConvoNotSet = false;

                  currentreact.setState({
                    data: historyData,
                    convo: val
                  });
                }
              });
              if (self.activeConvoNotSet === true) {
                this.setState({ data: historyData });
              }
              callback();
            } else {
              this.setState({ data: historyData });
            }
          }).bind(this),
          error: (function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }).bind(this)
        });
      },
      componentDidMount: function componentDidMount() {
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
            self.activeConvoNotSet = true;
            $.each(historyData, function (idx, val) {
              if (val.messages.length > 0) {
                self.activeConvoNotSet = false;

                this.setState({
                  data: historyData,
                  convo: val
                });
              }
            });
            if (self.activeConvoNotSet === true) {
              this.setState({ data: historyData });
            }

            var activereact = this;
            function loop() {

              if (self.lastDayFetch != self.historyMaxDaysBack) {
                activereact.historyLooper(function () {
                  loop();
                });
              }
            }
            loop();
          }).bind(this),
          error: (function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }).bind(this)
        });
      },
      setNewConvo: function setNewConvo(match) {
        this.setState({ convo: match.match });
      },
      render: function render() {
        return React.createElement(
          "div",
          { className: "chatUI" },
          React.createElement(MatchList, { data: this.state.data, activeConvo: this.state.convo, setNewConvo: this.setNewConvo }),
          React.createElement(ActiveConvo, { match: this.state.convo }),
          React.createElement(ConvoPhotos, { match: this.state.convo })
        );
      }
    });

    var MatchList = React.createClass({
      displayName: "MatchList",

      matchChangeHandler: function matchChangeHandler(match, x) {
        this.props.setNewConvo({ match: x });
      },
      render: function render() {
        var currentreact = this;
        var boundClick = this.matchChangeHandler.bind(null, this);
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
          var currently_active = '';
          if (match._id == currentreact.props.activeConvo._id) {
            currently_active = 'active';
          }
          return React.createElement(MatchCell, { key: match._id,
            profile: match['person']['photos'][0]['url'],
            name: match['person']['name'],
            last_three_messages: messages_only.join('<br />'),
            messaged: messaged.toString(),
            last_messaged: last_messaged,
            last_online: last_online,
            match_id: match['_id'],
            match: match,
            onMatchChange: boundClick,
            currently_active: currently_active });
        });
        return React.createElement(
          "div",
          { className: "matchList col-md-4" },
          matchNodes
        );
      }
    });

    var MatchCell = React.createClass({
      displayName: "MatchCell",

      handleClick: function handleClick(e) {
        this.props.onMatchChange(this.props.match);
      },
      render: function render() {
        var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
        function createMessage() {
          return {
            __html: messageExp
          };
        }
        return React.createElement(
          "div",
          { className: "matchCell row", "data-active": this.props.currently_active, onClick: this.handleClick, match_id: this.props['match_id'], messaged: this.props['messaged'] },
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

    var ActiveConvo = React.createClass({
      displayName: "ActiveConvo",

      handleMessageSubmit: function handleMessageSubmit(message) {
        //
      },
      // getInitialState: function() {
      //   return {match: {
      //     'messages':[{'from':'', 'message':''}]
      //   }};
      // },
      render: function render() {
        if (!this.props.match.hasOwnProperty('person')) {
          return React.createElement(
            "div",
            { className: "activeConvo noConvo col-md-6" },
            React.createElement(
              "div",
              { className: "convoHistoryBox" },
              React.createElement("i", { className: "fa fa-spinner fa-spin" })
            )
          );
        } else if (this.props.match.messages.length === 0) {
          return React.createElement(
            "div",
            { className: "activeConvo col-md-6" },
            React.createElement(
              "div",
              { className: "convoHistoryBox" },
              React.createElement(
                "h3",
                { className: "helptext" },
                "Kick off the conversation below!"
              )
            ),
            React.createElement(MessageInput, { onMessageSubmit: this.handleMessageSubmit })
          );
        } else {
          return React.createElement(
            "div",
            { className: "activeConvo col-md-6" },
            React.createElement(ConvoHistoryBox, { match: this.props.match }),
            React.createElement(MessageInput, { onMessageSubmit: this.handleMessageSubmit })
          );
        }
      }
    });

    var ConvoHistoryBox = React.createClass({
      displayName: "ConvoHistoryBox",

      render: function render() {

        var messages = this.props.match['messages'];
        var m = this.props.match;
        var started = 'false';

        if (messages.length > 0) {
          if (messages[0].from.length > 0) {
            started = 'true';
          }
        }
        var messageNodes = messages.map(function (message, idx) {
          var from = Global.tinderId == message['from'] ? "me" : "them";
          var first = false;
          if (idx === 0) {
            first = true;
          } else if (from == 'them') {
            first = messages[idx - 1]['from'] == m.person._id ? false : true;
          } else if (from == 'me') {
            first = messages[idx - 1]['from'] == Global.tinderId ? false : true;
          }
          var their_pic = '';
          if (m.hasOwnProperty('person')) {
            their_pic = m.person.photos[0].processedFiles[2].url;
          }

          var timestamp = '';
          if (message.hasOwnProperty('sent_date')) {
            var ts = message.sent_date;
            timestamp = moment(ts).fromNow();
          }

          return React.createElement(MessageBubble, { key: message._id,
            from: from,
            text: message['message'],
            first: first.toString(),
            their_pic: their_pic,
            started: started,
            timestamp: timestamp });
        });
        return React.createElement(
          "div",
          { className: "convoHistoryBox" },
          messageNodes
        );
      }
    });

    var MessageBubble = React.createClass({
      displayName: "MessageBubble",

      render: function render() {
        // var me = Global.tinderId;
        // var them = x._id;
        // var from = me == from ? "me" :"them";
        return React.createElement(
          "div",
          { className: "messageBubble row", "data-first": this.props.first, "data-from": this.props.from, "data-started": this.props.started },
          React.createElement(
            "div",
            { className: "col-md-1 col-md-offset-1" },
            React.createElement("img", { className: "mePhoto img-circle", src: Global.profilePic })
          ),
          React.createElement(
            "div",
            { className: "messageText col-md-8" },
            React.createElement(
              "p",
              null,
              this.props.text,
              React.createElement(
                "span",
                { className: "messageTimestamp" },
                this.props.timestamp
              )
            )
          ),
          React.createElement(
            "div",
            { className: "col-md-1" },
            React.createElement("img", { className: "themPhoto img-circle", src: this.props.their_pic })
          )
        );
      }
    });

    var MessageInput = React.createClass({
      displayName: "MessageInput",

      render: function render() {
        return React.createElement(
          "div",
          { className: "messageInput row" },
          React.createElement("img", { className: "col-md-2", src: Global.profilePic }),
          React.createElement("input", { className: "col-md-7", placeholder: "Enter your message here", type: "text" }),
          React.createElement(
            "div",
            { className: "submit col-md-3" },
            "send"
          )
        );
      }
    });

    var ConvoPhotos = React.createClass({
      displayName: "ConvoPhotos",

      render: function render() {
        return React.createElement("div", { className: "convoPhotos" });
      }
    });

    // REACT RENDER

    ReactDOM.render(React.createElement(ChatUI, { data: this.historyData }), document.getElementById('chat-ui'));
  };

  this.installObservers = function () {};
}

var Chat = new ChatClass();

// MatchList
//   MatchCell
//# sourceMappingURL=chat.js.map
