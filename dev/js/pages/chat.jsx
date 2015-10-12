/*jshint sub:true*/
/*jshint -W030 */

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
        return {data:[],convo:{'messages':[
          {'from':'', 'message':''}
        ]}};
      },
      historyLooper: function(callback) {
        var lookup = {
          "3": 7,
          "7": 14,
          "14":20,
        };

        var current_history = parseInt(self.lastDayFetch);
        var next = lookup[current_history];

        if (next == 20) {
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
            this.setState({data:historyData});
            callback();

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },
      componentDidMount: function() {
        console.log('mounted');
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
            this.setState({data:historyData});

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
        console.log('rendering...');
        console.log(this.state.convo);
        return (
          <div className="chatUI">
            <MatchList data={this.state.data} setNewConvo={this.setNewConvo} />
            <ActiveConvo match={this.state.convo} />
            <ConvoPhotos match={this.state.convo} />
          </div>
        )
      }
    });

    var MatchList = React.createClass({
      matchChangeHandler: function(match, x) {
        console.log('intermediary step...');
        console.log(x);
        console.log(match);
        this.props.setNewConvo({match:x});
      },
      render: function() {
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
              onMatchChange={boundClick} />
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
        console.log(this.props.match);
        console.log(this.props);
        this.props.onMatchChange(this.props.match);
      },
      render: function() {
        var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
        function createMessage() { return {
          __html: messageExp
        };}
        return (
          <div className="matchCell row" onClick={this.handleClick} match_id={this.props['match_id']} messaged={this.props['messaged']}>
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
        //
      },
      // getInitialState: function() {
      //   return {match: {
      //     'messages':[{'from':'', 'message':''}]
      //   }};
      // },
      render: function() {
        return (
          <div className="activeConvo col-md-6">
            <ConvoHistoryBox match={this.props.match}/>
            <MessageInput onMessageSubmit={this.handleMessageSubmit} />
          </div>
        )
      }
    })

    var ConvoHistoryBox = React.createClass({
      render: function() {
        console.log('next is props');
        console.log(this.props.match)
        var messages = this.props.match['messages'];
        console.log(messages);
        var messageNodes = messages.map(function(message, idx){
          console.log('message text: ' +message['message']);
          var from = Global.tinderId == message['from'] ? "me" :"them";
          console.log('from: '+from);
          var first = false;
          if(idx === 0){
            console.log('first, setting first to true');
            first = true;
          } else {
            console.log('last message is:');
            console.log(messages[idx-1]);
            first = messages[idx-1]['from'] == Global.tinderId ? true : false;
            console.log('first status is: '+first);
          }

          return (
            <MessageBubble from={from}
              text={message['message']}
              first={first.toString()} />
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
          <div className="messageBubble">
            <div className="messageText" dataFirst={this.props.first} dataFrom={this.props.from}>
              {this.props.text}
            </div>
          </div>
        )
      }
    });

    var MessageInput = React.createClass({
      render: function() {
        return (
          <div className="messageInput row">
            <img className="col-md-2" />
            <input className="col-md-7" placeholder="Enter your message here" type="text" />
            <div className="submit col-md-3">send</div>
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
