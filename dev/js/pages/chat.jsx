/*jshint sub:true*/

function ChatClass() {
  this.url = "/chat";

  this.init = function(){
    console.log('chat init');
    this.installObservers();
    var self = this;
    this.getHistory(function(historyData){
      console.log(historyData);
      self.historyData = historyData;
      self.createReact();
      self.renderConvo();
    });
	};

  this.createReact = function() {
    var MatchSidebar = React.createClass({
      render: function() {
        return (
          <div className="matchSidebar">
            <MatchList data={this.props.data} />
          </div>
        )
      }
    });

// <img className="matchPic" src={match['person']['photos'][0]['url']}/>
// <h3 className="matchName">{match['person']}</h3>

    var MatchCell = React.createClass({
      render: function() {
        var messageExp = this.props.messaged === 'true' ? this.props['last_three_messages'] : 'no messages yet';
        function createMessage() { return {
          __html: messageExp
        };}
        return (
          <div className="matchCell row" match_id={this.props['match_id']} messaged={this.props['messaged']}>
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

    var MatchList = React.createClass({
      render: function() {
        var x = 0;
        var matchNodes = this.props.data.map(function (match){
          x++;
          console.log(x);

          var last_three_messages = match['messages'].slice(-3);
          var messaged = true;
          if(match['messages'].length === 0) {
            messaged = false
          }
          var last_online = moment(match.last_activity_date).fromNow();

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
              last_online={last_online}
              match_id={match['_id']} />
          );
        });
        return  (
          <div className="matchList">
            {matchNodes}
          </div>
        )
      }
    });

    ReactDOM.render(
      <MatchList data={this.historyData} />,
      document.getElementById('match-list')
    );
  }

  this.renderConvo = function() {
    var ConvoBox = React.renderClass({
      render: function() {
        return (
          <div className="convoBox">
            <ConvoHistoryBox match={this.props.data}/>
          </div>
        )
      }
    })

    var ConvoHistoryBox = React.renderClass({
      render: function() {
        return (
          <div className="convoHistoryBox"></div>
        )
      }
    });

    var MessageBubble = React.renderClass({
      render: function() {
        return (
          <div className="messageBubble">
            <div className="messageText">
              {this.props.message_text}
            </div>
          </div>
        )
      }
    })

    var active_match = this.historyData[0]
    ReactDOM.render(
      <ConvoBox data={active_match} />,
      document.getElementById('active-convo')
    );
  };

  this.getHistory = function(callback) {
    console.log('get history');
    $.ajax({
        type: "POST",
        url: '/get_history',
        data: {
          'days_ago': 6
        },
        dataType: 'json',
        success: function(msg) {
          callback(msg.results);
        }
      });
  };

	this.installObservers = function(){
	};

}

var Chat = new ChatClass();

// MatchList
//   MatchCell
