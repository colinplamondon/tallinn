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
  this.historyMaxDaysBack = 14;
  this.init = function(){
    this.installObservers();
    this.createReact();
	};

  this.sortByDateProp = function(target_list, prop) {
    return target_list.sort(function(a, b){
      return Date.parse(b[prop]) - Date.parse(a[prop]);
    })

  };

  this.createReact = function() {
    var self = this;

    var ChatUI = React.createClass({
      loadUpdates: function() {
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'timestamp': self.initialFetch
          },
          dataType: 'json',
          success: function(msg) {
            var timestamp = msg.timestamp;
            var historyData = self.sortByDateProp(msg.results, 'last_activity_date');

            this.setState({data:historyData});
            self.lastFetch = timestamp;
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      getInitialState: function() {
        return {
          data:[],
          convo: {
            "_id":"",
            'messages':[
              {'from':'', 'message':''}
            ]
          }
        };
      },
      historyLooper: function(callback) {
        var lookup = {
          "3": 7,
          "7": 14,
          "14":20,
        };

        var current_history = parseInt(self.lastDayFetch);
        var next = lookup[current_history];
        if (next == 14) {
          setInterval(this.loadUpdates, 5000);
        }

        this.collectHistory(next, function(){
          callback();
        });

      },
      collectHistory: function(days_back, callback) {
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'days_ago': parseInt(days_back)
          },
          dataType: 'json',
          success: function(msg) {
            var timestamp = msg.timestamp;
            var historyData = self.sortByDateProp(msg.results, 'last_activity_date');

            self.lastFetch = timestamp;
            self.initialFetch = timestamp;
            self.lastDayFetch = days_back;

            if(self.activeConvoNotSet) {
              var currentreact = this;
              $.each(historyData, function(idx, val){
                if(val.messages.length>0) {
                  self.activeConvoNotSet = false;

                  currentreact.setState({
                    data:historyData,
                    convo:val
                  })
                }
              });
              if(self.activeConvoNotSet === true) {
                this.setState({data:historyData});
              }
              callback();
            } else {
              this.setState({data:historyData});
            }

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      componentDidMount: function() {
        console.log('mounted');
        var currentreact = this;
        $.ajax({
          type: "POST",
          url: '/get_history',
          data: {
            'days_ago': 3
          },
          dataType: 'json',
          success: function(msg) {
            var timestamp = msg.timestamp;
            var historyData = msg.results;

            self.lastFetch = timestamp;
            self.initialFetch = timestamp;
            self.lastDayFetch = 3;
            self.activeConvoNotSet = true;
            $.each(historyData, function(idx, val){
              if(val.messages.length>0) {
                self.activeConvoNotSet = false;

                currentreact.setState({
                  data:historyData,
                  convo:val
                })
              }
            });
            if(self.activeConvoNotSet === true) {
              currentreact.setState({data:historyData});
            }

            var activereact = this;
            function loop() {

              if(self.lastDayFetch != self.historyMaxDaysBack) {
                activereact.historyLooper(function(){
                  loop();
                });
              }
            }
            loop();
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      setNewConvo: function(match) {
        this.setState({convo:match.match});
      },
      render: function() {
        return (
          <div className="chatUI">
            <MatchList data={this.state.data} activeConvo={this.state.convo} setNewConvo={this.setNewConvo} />
            <ActiveConvo match={this.state.convo} />
            <ConvoPhotos match={this.state.convo} />
          </div>
        )
      }
    });

    var MatchList = React.createClass({
      matchChangeHandler: function(match, x) {
        this.props.setNewConvo({match:x});
      },
      render: function() {
        var currentreact = this;
        var boundClick = this.matchChangeHandler.bind(null, this);
        var matchNodes = this.props.data.map(function (match){
          var last_three_messages = match['messages'].slice(-3);
          var messaged = true;
          if(match['messages'].length === 0) {
            messaged = false
          }
          var last_messaged = moment(match.last_activity_date).fromNow();
          var last_online = moment(match.person.ping_time).fromNow();

          var messages_only = [];
          $.each(last_three_messages, function(idx, val){
            messages_only.push(val['message']);
          });
          var currently_active = ''
          if (match._id == currentreact.props.activeConvo._id) {
            currently_active = 'active'
          }
          return (
            <MatchCell key={match._id}
              profile={match['person']['photos'][0]['url']}
              name={match['person']['name']}
              last_three_messages={messages_only.join('<br />')}
              messaged={messaged.toString()}
              last_messaged={last_messaged}
              last_online={last_online}
              match_id={match['_id']}
              match={match}
              onMatchChange={boundClick}
              currently_active={currently_active} />
          );
        });
        return  (
          <div className="matchList col-md-4">
            {matchNodes}
          </div>
        )
      }
    });


    var MatchCell = React.createClass({
      handleClick: function(e) {
        this.props.onMatchChange(this.props.match);
      },
      render: function() {
        var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
        function createMessage() { return {
          __html: messageExp
        };}
        return (
          <div className="matchCell row" data-active={this.props.currently_active} onClick={this.handleClick} match_id={this.props['match_id']} messaged={this.props['messaged']}>
            <img className="col-md-4" src={this.props['profile']} />
            <div className="col-md-8">
              <span className="name">{this.props['name']}</span>
              <span className="lastonline">last online {this.props['last_online']}</span>
              <p dangerouslySetInnerHTML={createMessage()} />
            </div>
          </div>
        )
      }
    });

    var ActiveConvo = React.createClass({
      handleMessageSubmit: function(message) {
        this.setState({'submitting': true});
        var currentreact = this;
        var DONOTSEND = true;

        if(!DONOTSEND) {
          $.ajax({
            type: "POST",
            url: '/send_message',
            data: {
              'message': message,
              "match_id": this.props.match._id
            },
            dataType: 'json',
            success: function(msg) {
              currentreact.setState({'submitting':false})
            }.bind(this),
            error: function(xhr, status, err) {
              alert(err.toString());
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
        }
      },
      // getInitialState: function() {
      //   return {match: {
      //     'messages':[{'from':'', 'message':''}]
      //   }};
      // },
      render: function() {
        if(!this.props.match.hasOwnProperty('person')){
          return (
            <div className="activeConvo col-md-6">
              <div className="convoHistoryBox noConvo">
                <i className="fa fa-spinner fa-spin"></i>
              </div>
            </div>
          )
        } else if (this.props.match.messages.length === 0 ) {
          return (
            <div className="activeConvo col-md-6">
              <div className="convoHistoryBox">
                <h3 className="helptext">Kick off the conversation below!</h3>
              </div>
              <MessageInput onMessageSubmit={this.handleMessageSubmit}
                submitting=''
                placeholder="Enter your message here."/>
            </div>
          )
        } else {
          return (
          <div className="activeConvo col-md-6">
            <ConvoHistoryBox match={this.props.match}/>
            <MessageInput onMessageSubmit={this.handleMessageSubmit}
              submitting=''
              placeholder="Enter your message here." />
          </div>
        )
        }
      }
    })

    var ConvoHistoryBox = React.createClass({
      render: function() {

        var messages = this.props.match['messages'];
        var m = this.props.match;
        var started = 'false';

        if(messages.length >0 ) {
          if(messages[0].from.length > 0) {
            started = 'true';
          }
        }
        var messageNodes = messages.map(function(message, idx){
          var from = Global.tinderId == message['from'] ? "me" :"them";
          var first = false;
          if(idx === 0){
            first = true;
          } else if(from == 'them') {
            first = messages[idx-1]['from'] == m.person._id ? false : true;
          } else if (from == 'me') {
            first = messages[idx-1]['from'] == Global.tinderId ? false : true;
          }
          var their_pic = ''
          if (m.hasOwnProperty('person')) {
            their_pic = m.person.photos[0].processedFiles[2].url;
          }

          var timestamp = ''
          if(message.hasOwnProperty('sent_date')){
            var ts = message.sent_date;
            timestamp = moment(ts).fromNow();
          }

          return (
            <MessageBubble key={message._id}
              from={from}
              text={message['message']}
              first={first.toString()}
              their_pic={their_pic}
              started={started}
              timestamp={timestamp} />
          );
        });
        return (
          <div className="convoHistoryBox">
            {messageNodes}
          </div>
        )
      }
    });

    var MessageBubble = React.createClass({
      render: function() {
        // var me = Global.tinderId;
        // var them = x._id;
        // var from = me == from ? "me" :"them";
        return (
          <div className="messageBubble row" data-first={this.props.first} data-from={this.props.from} data-started={this.props.started}>
            <div className="col-md-1 col-md-offset-1">
              <img className="mePhoto img-circle" src={Global.profilePic} />
            </div>
            <div className="messageText col-md-8">
              <p>
                {this.props.text}
                <span className="messageTimestamp">{this.props.timestamp}</span>
              </p>
            </div>
            <div className="col-md-1">
              <img className="themPhoto img-circle" src={this.props.their_pic} />
            </div>
          </div>
        )
      }
    });

    var MessageInput = React.createClass({

      messageSubmit: function(e) {
        e.preventDefault();
        var msg = this.refs.msg.value.trim();
        if(!msg) {
          return;
        }
        this.props.onMessageSubmit(msg);
        this.props.submitting = 'submitting';
        this.props.placeholder = 'submitting';
        return;
      },
      render: function() {
        return (
          <div className="messageInput row">
            <img className="col-md-2" src={Global.profilePic} />

            <form className="messageForm" onSubmit={this.messageSubmit}>
              <input type="text" data-submitting={this.props.submitting} ref="msg" className="col-md-7" placeholder={this.props.placeholder} />
              <input type="submit" value="send" className="submit col-md-3" />
            </form>
          </div>
        )
      }
    });

    var ConvoPhotos = React.createClass({
      render: function() {
        return(
            <div className="convoPhotos" />
        )
      }
    })

    // REACT RENDER

    ReactDOM.render(
      <ChatUI data={this.historyData} />,
      document.getElementById('chat-ui')
    );  };

	this.installObservers = function(){
	};

}

var Chat = new ChatClass();

// MatchList
//   MatchCell
