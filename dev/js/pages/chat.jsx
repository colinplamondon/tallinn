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
        return (
          <div className="matchCell">
            <img src={this.props.profile} />
            <span>{this.props['name']}</span>
          </div>
        )
      }
    });

    var MatchList = React.createClass({
      render: function() {
        var matchNodes = this.props.data.map(function (match){
          console.log(match);
          console.log(match.person);
          console.log(match.person.photos);
          console.log(match.person.photos[0]);
          console.log(match.person.photos[0].url);

          return (
            <MatchCell key={match._id}
              profile={match['person']['photos'][0]['url']}
              name={match['person']['name']} />
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

  this.getHistory = function(callback) {
    console.log('get history');
    $.ajax({
        type: "POST",
        url: '/get_history',
        data: {
          'days_ago': 4
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
