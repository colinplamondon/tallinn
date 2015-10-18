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
