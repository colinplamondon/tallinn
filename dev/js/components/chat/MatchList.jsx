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
